import { useEffect, useState } from 'react';
import './App.css';
import audio1 from './assets/audio/1.mp3';
import audio2 from './assets/audio/2.mp3';
import useInterval from './useInterval';

function App() {
  const [people, setPeople] = useState(3);
  const [sec, setSec] = useState(0);
  const [delay, setDelay] = useState(1000); // 1초
  
  const sound1 = new Audio(audio1);
  const sound2 = new Audio(audio2);
  
  const initialScore = (size = people) => {
    return new Array(size).fill(['']);
  }
  const initialWins = (size = people) => {
    let arr = [];
    for(let i = 0; i < size; i++){
      arr[i] = {
        id: i,
        score: 0,
      }
      for(let j = 1; j <= size; j++){
        arr[i][j] = 0;
      }
    }
    return arr;
  }
  const [score, setScore] = useState(initialScore);
  const [wins, setWins] = useState(initialWins);

  useInterval(() => {
    if(sec > 0){
      setSec(prev => prev - 1);
      if(sec === 91 || sec === 61 || sec === 31){
        sound1.play();
      }
      if(sec === 1){
        sound2.play();
      }
    }
  }, delay);

  useEffect(() => {
    if(delay === null){
      setDelay(1000);
    }
  }, [delay])

  // 스페이스바 클릭 시 타이머를 시작하는 핸들러 추가
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

  // localStorage에 저장된 정보 가져옴
  useEffect(() => {
    let _people = localStorage.getItem('people');
    let _score = localStorage.getItem('gamescore');
    let _wins = localStorage.getItem('gamewins');
    
    if(_people && _score && _wins){
      setScore(JSON.parse(_score));
      setWins(JSON.parse(_wins));
      setPeople(Number(_people));
    }
  }, []);

  // input에 점수 입력
  const handleInputEnter = (e, i, i2) => {
    let _score = score.map(innerArray => [...innerArray]);
    _score[i][i2] = e.target.value;
    setScore(_score);
  }

  // 인원 추가
  const handlePeopleAdd = () => {
    let _people = people + 1;
    setPeople(_people);
    setScore(initialScore(_people));
    setWins(initialWins(_people));
  }
  // 인원 삭제
  const handlePeopleDelete = () => {
    if(people > 1){
      let _people = people - 1;
      setPeople(_people);
      setScore(initialScore(_people));
      setWins(initialWins(_people));
    }
  }
  // 게임 초기화
  const handleReset = () => {
    setWins(initialWins(people));
    setScore(initialScore(people));
  }
  // 점수 계산
  const handleCalculate = () => {
    let _nowScore = [];
    let _nowGame = score[0].length - 1;
    for(let i = 0; i < people; i++){
      if(score[i][_nowGame] === '') return;

      if(!!Number(score[i][_nowGame]))
        _nowScore.push(Number(score[i][_nowGame]));
      else return;
    }
    
    // 한 명은 무조건 1등, 나머지는 2등/3등/...
    // 만약 점수가 같은 경우 등수 하나씩 내림
    let _wins = [...wins];
    for(let i = 0; i < people; i++){
      let rank = 1;
      for(let j = 0; j < people; j++){
        if(i !== j){
          if(_nowScore[i] <= _nowScore[j]) rank++;
        }
      }
      _wins[i][rank]++;
      _wins[i]['score'] += _nowScore[i];
    }
  
    setWins(_wins);
    setScore((prev) => prev.map(v => v.concat([''])));

    // localStorage에 저장
    localStorage.setItem('people', people);
    localStorage.setItem('gamewins',JSON.stringify(_wins));
    localStorage.setItem('gamescore',JSON.stringify(score.map(v => v.concat(['']))));
  }

  return (
    <div className="App" tabIndex="0" style={{width: '100vw', height: "100vh", padding: "50px", boxSizing: 'border-box'}}>
      {Math.floor(sec / 60)} : {sec % 60}
      <div className='score'>
        <div style={{textAlign: 'start'}}>
          <button style={{marginRight: '10px'}} className='score-calculate' onClick={handlePeopleAdd}>인원 추가</button>
          <button style={{marginRight: '10px'}} className='score-calculate' onClick={handlePeopleDelete}>인원 삭제</button>
        </div>
        {score.map((v, i) => (
          <div key={`row - ${i}`} className='score-row'>
            <span className='score-name'>player {i + 1})</span>
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
              {people > 1 ? (
                <>
                  {Array.from({length: people}).map((_, rank) => (
                    rank + 1 < people ? wins[i][rank + 1] + ' / ' : wins[i][rank + 1] + ` (${wins[i]['score']})`
                  ))}
                </>
              ) : (
                <>
                  ({wins[i]['score']})
                </>
              )}
            </span>
          </div>
        ))}
        <div style={{textAlign: 'start'}}>
          <button style={{marginRight: '10px'}} className='score-calculate' onClick={handleCalculate}>계산</button>
          <button style={{marginRight: '10px'}} className='score-calculate' onClick={handleReset}>초기화</button>
        </div>
      </div>
    </div>
  );
}

export default App;
