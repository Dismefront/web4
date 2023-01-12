import React, { Fragment, useState, useEffect } from 'react';
import '../styles/main.css';
import Button from 'react-toolbox/lib/button/Button';
import Input from 'react-toolbox/lib/input/Input';
import Nav from './Navbar';
import 'jsxgraph';
import { evaluate, isNumber } from 'mathjs';
import axios from 'axios';
import $ from 'jquery';
import JXG from 'jsxgraph';

var board = null;

function getMouseCoords(e) {
    let cPos = board.getCoordsTopLeftCorner(e),
        absPos = JXG.getPosition(e),
        dx = absPos[0] - cPos[0],
        dy = absPos[1] - cPos[1];

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
}

function Main() {
    const [inpVal, setInpVal] = useState("");
    const [resInp, setResInp] = useState(0);
    const [chooseError, setChooseError] = useState("");
    const [attempts, setAttempts] = useState([]);

    const boundaries = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

    const [xSet, setXbtns] = useState(new Array(boundaries.length).fill(false));
    const [rSet, setRbtns] = useState(new Array(boundaries.length).fill(false));

    function initBoard() {
        if (board)
            JXG.JSXGraph.freeBoard(board);
        board = JXG.JSXGraph.initBoard(
            "board",
            { boundingbox: [-5, 5, 5, -5], axis: true, showNavigation: false, showCopyright: false }
        );
    }

    const handleSubmitByGraph = (x, y, r) => {
        axios.post("http://localhost:7040/api/attempts/try", {
            x, y, r
        }).then(response => {
            console.log("123");
            setAttempts([...attempts, response.data]);
        }).catch(err => {
            if (err.response.status === 403 || err.response.status === 423)
                setChooseError("Something went wrong. Consider relogging in")
        });
    }

    useEffect(() => {
        initBoard();
        board.on("down", (e) => {
            let coords = getMouseCoords(e);
            let c1 = coords.usrCoords[1].toFixed(3);
            let c2 = coords.usrCoords[2].toFixed(3);

            if (c1 < -4 || c1 > 4 || c2 <= -5 || c2 >= 5)
                return;
            for (let i = 0; i < boundaries.length; i++) {
                if (rSet[i]) {
                    handleSubmitByGraph(c1, c2, boundaries[i]);
                }
            }
        });
        let graphparams = {
            fixed: true,
            vertices: { visible: false },
            strokeWidth: 2,
            fillOpacity: 0,
            borders: {
                strokeWidth: 2,
                strokeOpacity: 0.8,
                fixed: true
            },
            strokeOpacity: 0.8
        };
        for (let i = 0; i < boundaries.length; i++) {
            if (!rSet[i])
                continue;
            let r = boundaries[i];
            if (r > 0) {
                board.create('polygon', [[0, 0], [0, r / 2], [r / 2, 0]], graphparams);
                board.create('ellipse', [[0, 0], [0, 0], [r, 0], Math.PI / 2, Math.PI], graphparams);
                board.create('polygon', [[0, 0], [0, -r], [r / 2, -r], [r / 2, 0]], graphparams);
            }
            else {
                board.create('polygon', [[0, 0], [0, r / 2], [r / 2, 0]], graphparams);
                board.create('ellipse', [[0, 0], [0, 0], [r, 0], 0, -Math.PI / 2], graphparams);
                board.create('polygon', [[0, 0], [0, -r], [r / 2, -r], [r / 2, 0]], graphparams);
            }
            attempts.filter(x => x.r === r).forEach(x => {
                if (x.result)
                    board.create('point', [x.x, x.y], {
                        fixed: true, size: 1, name: "", color: "green"
                    });
                else
                    board.create('point', [x.x, x.y], {
                        fixed: true, size: 1, name: "", color: "red"
                    });
            });
        }
    }, [attempts, rSet]);

    useEffect(() => {
        axios.get("http://localhost:7040/api/attempts/get").then(response => {
            setAttempts(response.data);
        }).catch(err => {
            if (err.response.status === 403 || err.response.status === 423)
                setChooseError("Something went wrong. Consider relogging in")
        });
    }, []);

    const xClickHandler = (index) => {
        const newArray = [...xSet];
        newArray[index] = !newArray[index];
        setXbtns(newArray);
    };

    const rClickHandler = (index) => {
        const newArray = [...rSet];
        newArray[index] = !newArray[index];
        setRbtns(newArray);
    };

    const handleSubmit = () => {
        if (!isNumber(resInp))
            return;
        let flag = false;
        for (let i = 0; i < rSet.length; i++) {
            if (!rSet[i])
                continue;
            for (let j = 0; j < xSet.length; j++) {
                if (!xSet[j])
                    continue;
                axios.post("http://localhost:7040/api/attempts/try", {
                    x: boundaries[j],
                    y: resInp,
                    r: boundaries[i]
                }).then(response => {
                    setAttempts([...attempts, response.data]);
                }).catch(err => {
                    if (err.response.status === 403 || err.response.status === 423)
                        setChooseError("Something went wrong. Consider relogging in")
                });
                flag = true;
            }
        }
        if (!flag)
            setChooseError("Please choose at least one of each elements");
        else
            setChooseError("");
    }

    return (
        <Fragment>
            <Nav />
            <div className="wrapper">
                <div className="main-container">
                    <div className="left-side">
                        <div className="choose-title">X-Axis</div>
                        <div className="choose-from ballas">
                            <Button className={xSet[0] ? "toggled1" : ""} label="-4" onClick={() => xClickHandler(0)} />
                            <Button className={xSet[1] ? "toggled1" : ""} label='-3' onClick={() => xClickHandler(1)} />
                            <Button className={xSet[2] ? "toggled1" : ""} label='-2' onClick={() => xClickHandler(2)} />
                            <Button className={xSet[3] ? "toggled1" : ""} label='-1' onClick={() => xClickHandler(3)} />
                            <Button className={xSet[4] ? "toggled1" : ""} label='0' onClick={() => xClickHandler(4)} />
                            <Button className={xSet[5] ? "toggled1" : ""} label='1' onClick={() => xClickHandler(5)} />
                            <Button className={xSet[6] ? "toggled1" : ""} label='2' onClick={() => xClickHandler(6)} />
                            <Button className={xSet[7] ? "toggled1" : ""} label='3' onClick={() => xClickHandler(7)} />
                            <Button className={xSet[8] ? "toggled1" : ""} label='4' onClick={() => xClickHandler(8)} />
                        </div>
                        <div className="choose-title">Y-Axis</div>
                        <Input type="text" value={inpVal} onInput={e => {
                            try {
                                let res = 0;
                                if (e.target.value !== "")
                                    res = evaluate(e.target.value.replace(",", "."));
                                if (!isNumber(res)) {
                                    throw new Error();
                                }
                                setResInp(res);
                            } catch (error) {
                                setResInp("Incorrect value");
                            }
                            setInpVal(e.target.value);
                        }}
                            placeholder='Value in borders (-5 ... 5)' name='password' />
                        {
                            resInp === "" ? "0" : resInp
                        }
                        <div className="choose-title">Radius</div>
                        <div className="choose-from groovest">
                            <Button className={rSet[0] ? "toggled2" : ""} label="-4" onClick={() => rClickHandler(0)} />
                            <Button className={rSet[1] ? "toggled2" : ""} label='-3' onClick={() => rClickHandler(1)} />
                            <Button className={rSet[2] ? "toggled2" : ""} label='-2' onClick={() => rClickHandler(2)} />
                            <Button className={rSet[3] ? "toggled2" : ""} label='-1' onClick={() => rClickHandler(3)} />
                            <Button className={rSet[4] ? "toggled2" : ""} label='0' onClick={() => rClickHandler(4)} />
                            <Button className={rSet[5] ? "toggled2" : ""} label='1' onClick={() => rClickHandler(5)} />
                            <Button className={rSet[6] ? "toggled2" : ""} label='2' onClick={() => rClickHandler(6)} />
                            <Button className={rSet[7] ? "toggled2" : ""} label='3' onClick={() => rClickHandler(7)} />
                            <Button className={rSet[8] ? "toggled2" : ""} label='4' onClick={() => rClickHandler(8)} />
                        </div>
                        <div className="send">
                            <Button label="Send" id="applybtn" onClick={handleSubmit} />
                            {/* <Button label="Clear" id="clearbtn" /> */}
                        </div>
                        {
                            chooseError && <p style={{ color: "red" }}>{chooseError}</p>
                        }
                    </div>

                    <div className="right-side">
                        <div id="board" className="jxgbox"
                            style={{
                                width: "300px",
                                height: "300px",
                                backgroundColor: "white",
                                borderRadius: "10px"
                            }}></div>
                        <p>*The function appears as soon as you choose the radius to work with</p>
                    </div>

                    <div className="result-table">
                        <table id='tb-result'>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Result</th>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>R</th>
                                    <th>Execution time</th>
                                    <th>Current time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    attempts.length !== 0 ? attempts.map(data =>
                                    (<tr key={"id" + data.id}>
                                        <th>{data.id}</th>
                                        <td style={{ backgroundColor: data.result ? "green" : "red" }}>
                                            {data.result ? "HIT" : "MISS"}
                                        </td>
                                        <td>{data.x}</td>
                                        <td>{data.y}</td>
                                        <td>{data.r}</td>
                                        <td>{data.executionTime} millsec</td>
                                        <td>{data.issuedDate}</td>
                                    </tr>)).reverse() : <></>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Main;