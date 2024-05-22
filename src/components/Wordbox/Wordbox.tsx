import { useState, useEffect } from 'react';
import './style.css';

interface IWordBoxProps {
  word : string;
  onFinish : (value : boolean) => void;
  onMistake : (value : boolean) => void;
  active : boolean;
}

const Wordbox : React.FC<IWordBoxProps> = ({ word, onFinish, onMistake, active }) => {
  const [lettersLeft, setLettersLeft] = useState<string>(word);  
  const [mistake, setMistake] = useState<boolean>(false);
  
  const handleKeyUp = (e: KeyboardEvent) => {
    if (active) {
      let slovo = '';
      slovo = lettersLeft;

      // Check if the key pressed is an alphanumeric character
      const isAlphanumeric = /^[A-Za-z0-9]$/i.test(e.key);
      if (isAlphanumeric) {
        if (e.key.toLowerCase() === slovo.charAt(0)) {
//          console.log("Stisknuto: " + e.key);
          slovo = slovo.substring(1, slovo.length);
          setLettersLeft(slovo);
          setMistake(false);
          
        } else {
//          console.log('Chybny stisk: ' + e.key);
          onMistake(true);
          setMistake(true);
          if (slovo.length === 0) return;
        }
        if ((slovo === null) || (slovo.length === 0))  {
    //      setLettersLeft('');
          onFinish(true);
          return; 
        }
      } else {
//        console.log("Stisknuto neco jineho nez a-z,A-Z,0-9: " + e.key);
      }
    } 
  }

  useEffect (() => {
    if (active) {
      document.addEventListener('keydown', handleKeyUp);
      return () => document.removeEventListener('keydown', handleKeyUp);
    } else {
//      console.log('Neaktivni slovo:' + word)
    }
    }, [lettersLeft, handleKeyUp, onMistake, onFinish]);

  return (
      <>
        {active ? 
          <div className={mistake ? "wordbox--mistake" : "wordbox" }
              onKeyDown={() => handleKeyUp}>
            {lettersLeft}
          </div>
            : 
          <div className="wordbox--inactive" 
              onKeyDown={() => handleKeyUp}> 
            {lettersLeft}
          </div>
        }
        </>
  );
};

export default Wordbox;
