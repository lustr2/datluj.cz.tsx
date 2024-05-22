import { useState, useEffect } from 'react';
import Wordbox from '../Wordbox/Wordbox';
import wordList from '../../word-list';
import './style.css';

// TODO: temporary disable function - remove next line when you start using it
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */

const generateWord = (size: number) => {
  const sizeIndex = size === undefined
    ? Math.floor(Math.random() * wordList.length)
    : size - 3;
  
  if (sizeIndex < 0 || sizeIndex >= wordList.length) {
    return null;
  }
  
  const words = wordList[sizeIndex];
  const wordIndex = Math.floor(Math.random() * words.length);
  return words[wordIndex];
};

const napln = (kolik : number, words1 : string[], delka : number) => {
  let pocetNaZacatku : number = kolik;
  while (words1.length < pocetNaZacatku) {
    let newWordStart = generateWord(delka); //  Math.round(Math.random() * wordList.length));
//    console.log('Nove slovo:' + newWordStart);
    newWordStart && words1.push(newWordStart);
  }
  return words1;
}

const Stage = () => {
  const [generatedLength, setGeneratedLength] = useState<number>(3);
  const [words, setWords] = useState<string[]>(() => napln(1, [], generatedLength)); // (['jahoda']);
  const [pocetChyb, setPocetChyb] = useState<number>(5);
  //const [active, setActive] = useState(true);
  const [pocetSlov, setPocetSlov] = useState<number>(1);
  const [totalWords, setTotalWords] = useState<number>(1);
  const [countWithoutFalse, setCountWithoutFalse] = useState<number>(0);
  const [activeWordMistake, setActiveWordMistake] = useState<boolean>(true);

  useEffect(() => {
    let pocetNaZacatku : number = pocetSlov;
    while (words.length < pocetNaZacatku) {
      let newWordStart = generateWord(generatedLength); //Math.round(Math.random() * wordList.length));
//      console.log('Nove slovo:' + newWordStart);
      newWordStart && words.push(newWordStart);
    }
  });

  const handleFinish = () => {
    let pocet: number = 0;
    //setActive(false);
    setTotalWords(oldTotal => oldTotal+1);
    activeWordMistake ? setCountWithoutFalse(countWithoutFalse+1) : setActiveWordMistake(!activeWordMistake); 
    let newWord = generateWord(generatedLength); // Math.round(Math.random() * wordList.length));
    while ((newWord === null) && (pocet < 100)) {
//      console.log('Nove slovo:' + newWord);
      newWord = generateWord(generatedLength);// Math.round(Math.random() * wordList.length));
      pocet++;
    }
    setWords((oldWords) => {
              const newW = oldWords.slice(1); 
              return [...newW, newWord!]
            } );
  }
  
  const handleClickFalse = () => {
    let dalsiChyba : number = pocetChyb - 1;
    setPocetChyb(dalsiChyba);
    setActiveWordMistake(oldActive => !oldActive);
  };

  const handleClickReset = () => {
    //    console.log('Kliknuto na new game');
        setPocetChyb(5);
        setTotalWords(1);
        setCountWithoutFalse(0);
        setActiveWordMistake(true);
        setWords(() => napln(pocetSlov, [], generatedLength));
  }
   
  const handleClickPlus = () => {
    if (pocetSlov < 10) {
      setPocetSlov(oldPocetSlov => oldPocetSlov + 1);
    } else {
      console.log('Max 10 !!!');
      return;
    }
    let pocet : number = 0;
    let newWord = generateWord(generatedLength); // Math.round(Math.random() * wordList.length));
    while ((newWord === null) && (pocet < 100)) {
//      console.log('Nove slovo:' + newWord);
      newWord = generateWord(generatedLength); // Math.round(Math.random() * wordList.length));
      pocet++;
    }
    if (pocet === 100) {
      alert("Neco se nepovedlo ...");
      return;
    }
    setWords(oldWords => [...oldWords, newWord!]);
  }

  const handleClickMinus = () => {
    if (pocetSlov > 1) {
      setPocetSlov(oldPocetSlov => oldPocetSlov - 1);
    } else {
      console.log('Min 1 !!!');
      return;
    }
    let ps:number = pocetSlov-1;
    setWords(oldWords => [...oldWords.slice(0, ps)]);
  }
 
  const handleClickZmena = () => {
    //    console.log('Kliknuto na vymen slova');
        setWords(()=> napln( pocetSlov, [], generatedLength));
  }

  const handleClickUp = () => {
    setGeneratedLength(oldLen => (oldLen<wordList.length) ? oldLen+1: (oldLen>wordList.length? wordList.length-1 : oldLen));
  }

  const handleClickDown = () => {
    setGeneratedLength(oldLen => (oldLen > 3) ? oldLen-1: (oldLen < 3 ? 3: oldLen));
  }

  const handleClickRandom = () => {
    setGeneratedLength(Math.round(Math.random() * wordList.length)+2);
  }

  return (
    <div className="stage">
        <div className='ikonka'>
              <button className='button ikonka' title="Přidej počet slov (max 10)" type='button' onClick={handleClickPlus} disabled={pocetSlov===10}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>Add
              </button>
              <button className='button ikonka' title="Uber počet slov (min 1)" onClick={handleClickMinus} disabled={pocetSlov===1} >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>Del
              </button>
              <label className='button-invisible'></label>              
              <button className='button ikonka' title="Počet správně napsaných slov/celkový počet slov" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="green" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>Bez chyby: {countWithoutFalse}/{totalWords}
              </button>
              <label className='button-invisible'></label>
              <button className='button ikonka' title="Vyměnit slova" onClick={handleClickZmena} disabled={pocetChyb === 0} >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>Vyměň slova
              </button>
              <label className='button-invisible'></label>
              <button className='button ikonka' title="Životů" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>Životů: {pocetChyb}
              </button>

        </div>
      { (pocetChyb > 0) ?
        <div className="stage__words">
          {words.map((word, index) => 
            <Wordbox key={index+word} 
                    word={word} 
                    onFinish={handleFinish} 
                    onMistake={handleClickFalse} 
                    active={(index===0) ? true : false} />)}
        </div>
        :
        <div>
          <center><b>KONEC - {countWithoutFalse}/{totalWords} správně dokončených slov</b><br /><br />
          <button className='button ikonka' title="Nova hra" onClick={handleClickReset}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
                </svg>Znovu
              </button></center><br /><br />
        </div>
      }
      <div className='textik'>Délka slov (3-18 znaků): {generatedLength}</div>
      <button className='button ikonka' title={`Delší slova (${generatedLength} znaků) + 1 znak`} onClick={handleClickUp} disabled={generatedLength === wordList.length}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      <button className='button ikonka' title={`Kratší slova (${generatedLength} znaků) - 1 znak`} onClick={handleClickDown} disabled={generatedLength === 3}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
{/*       <button className='button ikonka' title={`Náhodně velká slova (${generatedLength} znaků) - změň`} onClick={handleClickRandom} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      </button>
*/}
    </div>
  );
};

export default Stage;
