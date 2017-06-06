// TODO https://facebook.github.io/react/tutorial/tutorial.html#wrapping-up

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={'square ' + (props.highlight ? 'highlight' : '')} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    const highlight = this.props.winnerLine && this.props.winnerLine.indexOf(i) >= 0;
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={highlight}
      />
    );
  }

  render() {
    const numRows = 3;
    const numCols = 3;
    let rows = [];
    for (let r = 0; r < numRows; r++) {
      let row = [];
      for (let c = 0; c < numCols; c++) {
        row[c] = this.renderSquare(r * numRows + c);
      }
      rows[r] = <div key={r} className="board-row">{row}</div>;
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      orderIsAscending: true
    };
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleChangeOrder(orderIsAscending) {
    this.setState({
      orderIsAscending: orderIsAscending
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: !(step % 2)
    })
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {

      if (!this.state.orderIsAscending) {
        move = (history.length - 1) - move;
      }
      const desc = move ? 'Move #' + move : 'Game Start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.label;
    } else {
      status =  'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine={winner ? winner.line : null}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            Move order:
            <label>
              <input
                type="radio"
                name="move-ordering"
                defaultChecked={this.state.orderIsAscending}
                onChange={(event) => this.handleChangeOrder(event.target.value)}/>
              Ascending
            </label>
            <label>
              <input
                type="radio"
                name="move-ordering"
                onChange={(event) => this.handleChangeOrder(!event.target.checked)}/>
              Descending
            </label>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {

  const lines = [
    [0, 1, 2], // first line
    [3, 4, 5], // second line
    [6, 7, 8], // third line
    [0, 3, 6], // first column
    [1, 4, 7], // second column
    [2, 5, 8], // third column
    [0, 4, 8], // main diagonal
    [2, 4, 6], // secondary diagonal
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        label: squares[a],
        line: [a, b, c]
      };
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
