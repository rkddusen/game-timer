import { useEffect, useState } from 'react';
import './App.css';
import useInterval from './useInterval';

function App() {
  const NAME = ['아빠', '엄마', '나'];
  const PEOPLE = NAME.length;
  const [sec, setSec] = useState(0);
  const [delay, setDelay] = useState(1000); // 1초
  const [score, setScore] = useState(new Array(PEOPLE).fill(['']));

  const audio1 = new Audio('./audio/1.mp3');
  const audio2 = new Audio('./audio/2.mp3');

  const initialItem = () => {
    let arr = [];
    for(let i = 0; i < PEOPLE; i++){
      arr[i] = {
        id: i,
        score: 0,
      }
      for(let j = 1; j <= PEOPLE; j++){
        arr[i][j] = 0;
      }
    }
    return arr;
  }
  const [wins, setWins] = useState(initialItem);

  useInterval(() => {
    if(sec > 0){
      setSec(prev => prev - 1);
      if(sec === 91 || sec === 61 || sec === 31){
        audio1.play();
      }
      if(sec === 1){
        audio2.play();
      }
    }
  }, delay);

  useEffect(() => {
    if(delay === null){
      setDelay(1000);
    }
  }, [delay])

  useEffect(() => {
    const handleKeyUp = (event) => {
      if((event.key === " ")){
        setDelay(null);
        setSec(89);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleInputEnter = (e, i, i2) => {
    let _score = score.map(innerArray => [...innerArray]);
    _score[i][i2] = e.target.value;
    setScore(_score);
  }

  const handleCalculate = () => {
    let _wins = [...wins];
    let _nowScore = [];
    let _nowGame = score[0].length - 1;
    for(let i = 0; i < PEOPLE; i++){
      if(score[i][_nowGame] === '') return;
      _nowScore.push(Number(score[i][_nowGame]));
    }
    
    for(let i = 0; i < PEOPLE; i++){
      let rank = 1;
      for(let j = 0; j < PEOPLE; j++){
        if(i !== j){
          if(_nowScore[i] < _nowScore[j]) rank++;
        }
      }
      _wins[i][rank]++;
      _wins[i]['score'] += _nowScore[i];
    }

    setWins(_wins);
    setScore((prev) => prev.map(v => v.concat([''])));
  }

  return (
    <div className="App" tabIndex="0" style={{width: '100vw', height: "100vh", padding: "50px", boxSizing: 'border-box'}}>
      {Math.floor(sec / 60)} : {sec % 60}
      <div className='score'>
        {score.map((v, i) => (
          <div key={`row - ${i}`} className='score-row'>
            <span className='score-name'>{NAME[i]})</span>
            {v.map((v2, i2) => i2 !== v.length - 1 ? (
              <div className='score-value' key={`row - ${i2}`}>
                {v2}
              </div>
            ) : (
              <input
                key={`row - ${i2}`}
                type='text'
                className='score-input'
                value={v2}
                onChange={(e) => handleInputEnter(e, i, i2)} />
            ))}
            <span className='score-result'>
              {Array.from({length: PEOPLE}).map((_, rank) => (
                rank + 1 < PEOPLE ? wins[i][rank + 1] + ' / ' : wins[i][rank + 1] + ` (${wins[i]['score']})`
              ))}
            </span>
          </div>
        ))}
        <button className='score-calculate' onClick={handleCalculate}>계산</button>
      </div>
    </div>
  );
}

export default App;
