import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
    /* Square do not need status and only have a render method,
    so we can implement it as a function component.*/
    return (
        <button
        className='square'
        onClick={props.onClick}// when clicked, call passed in onClick
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare ( i ) {
        //return a react element
        return (
        <Square
        value={ this.props.squares[i] }
        onClick={ () => this.props.onClick(i)}
        />
        );
    }


    render () {
        // render returns a react element
        return (
            <div>
                <div className="board-row">
                    { this.renderSquare( 0 ) }
                    { this.renderSquare( 1 ) }
                    { this.renderSquare( 2 ) }
                </div>
                <div className="board-row">
                    { this.renderSquare( 3 ) }
                    { this.renderSquare( 4 ) }
                    { this.renderSquare( 5 ) }
                </div>
                <div className="board-row">
                    { this.renderSquare( 6 ) }
                    { this.renderSquare( 7 ) }
                    { this.renderSquare( 8 ) }
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    
    constructor(props){
        // when override constructor, super(props) always need to be called first
        super(props);

        this.state = {
            // history is a list(array) of objects which only have one pair, squares: statusArray
            history: [{
                squares: Array(9).fill(null),
            }],

            stepNumber: 0,
            xIsNext: true,
            winner: null,
        };

    }

    handleClick(i){
        /*usually (this.state.stepNumber + 1) equals history.length,
         but when time travelling, (this.state.stepNumber) will be set to the step number*/
        const history = this.state.history.slice(0, this.state.stepNumber + 1); 

        // current is the last element in history
        const current = history[history.length - 1];
        // current is the object with only one attribute: squares
        const squares = current.squares.slice();
        // if there is a winner or the square is occupied, then return
        if (this.state.winner || squares[i]){
            return;
        }

        // update the square[i]
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
          winner: calculateWinner(squares),
        });
    }

    jumpTo(step) {
        // change game state
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

    render () {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.state.winner;

        const moves = history.map((step, move) => {
            // method signature: map((element, index) => { /* ... */ })
            // step is objects of squares: statusArray pair
            // move is the index, from 0 to history.length - 1
            const desc = move ?
              'Go to move #' + move :
              'Go to game start';
            return (
            // after mapping, moves becomes a list of <li> of button
              <li key={move}>
                <button onClick={() => this.jumpTo(move)}>
                    {desc}
                </button>
              </li>
            );
          });

        let status;

        if(winner){
            status = `Winner: ${winner}`
        }else{
            status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++){
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById( 'root' )
);

