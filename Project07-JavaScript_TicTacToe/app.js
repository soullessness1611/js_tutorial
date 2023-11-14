(function e(t,n,r){functlay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide();
    }, self.options.delay.hide);
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip.detach().css({ top: 0, left: 0, display: 'block' }).addClass(placement).data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos = this.getPosition();
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' : placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' : placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' : placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' : placement;

        $tip.removeClass(orgPlacement).addClass(placement);
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function complete() {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that);
      };

      $.support.transition && this.$tip.hasClass('fade') ? $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip = this.tip();
    var width = $tip[0].offsetWidth;
    var hion s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

//=============================================
//utility functions
arrayHas = function (arr, val) {
	// the val might be a single value or array of values

	if (Array.isArray(val)) {
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = val[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var i = _step.value;

				if (arr.indexOf(i) === -1) {
					return false;
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return true;
	}

	if (arr.indexOf(val) === -1) {
		return false;
	}

	return true;
};
//=============================================

//This is the app module
//Module Dependencieds
'use strict';
var $ = require('jquery'),

//jQuery    = $,
bootstrap = require('bootstrap'),

//Module Variables
human,
    computer,
    arrayHas,
    gameGrid = {
	rows: [[0, 1, 2], [3, 4, 5], [6, 7, 8]],
	columns: [[0, 3, 6], [1, 4, 7], [2, 5, 8]],
	diagonal1: [[0, 4, 8]],
	diagonal2: [[2, 4, 6]]
},
    gamePoints = [0, 1, 2, 3, 4, 5, 6, 7, 8],
    jQMap = {},
    configMap = {};

human = {
	moves: [],
	play: function play() {
		//event handler
		//'this' is a DOM
		var move = undefined,
		    $this = $(this),
		    $symbol = $this.children('.symbol');

		if ($symbol.text()) {
			return false;
		}

		$symbol.text(configMap.humanSymbol || 'X');
		move = +$this.attr('id');
		human.moves.push(move);
		jQMap.$playBox.off('click');
		setTimeout(function () {
			computer.playNextTurn.call(computer);
			jQMap.$playBox.on('click', human.play);
		}, 300);
		return false;
	}
};

computer = {
	winningPoints: undefined,
	playNextTurn: undefined,
	moves: [],
	startPoints: [0, 2, 4, 6, 8],
	centerParttern: false,
	fourthWinningOptions: [{ blockedPoint: 0, winningOptions: [1, 3] }, { blockedPoint: 2, winningOptions: [1, 5] }, { blockedPoint: 6, winningOptions: [3, 7] }, { blockedPoint: 8, winningOptions: [7, 5] }],

	makeFirstMove: function makeFirstMove() {
		var move;
		move = this.startPoints[Math.round(Math.random() * (this.startPoints.length - 1))];
		//move = 4;// this assignment is purely for test purpose.  REMOVE IT
		this.centerParttern = move === 4 ? true : false;
		this.makeMOve(move);
		this.playNextTurn = this.makeSecondMove;
	},
	makeSecondMove: function makeSecondMove() {
		var secondMove,
		    firstHumanMove = human.moves[0],
		    computerFirstOptions = {
			0: {
				computerOptions: [2, 6],
				humanOptions: [{ opt: 1, move: 2 }, { opt: 2, move: 6 }, { opt: 4, move: 8 }, { opt: 3, move: 6 }, { opt: 6, move: 2 }]
			},
			2: {
				computerOptions: [0, 8],
				humanOptions: [{ opt: 1, move: 0 }, { opt: 0, move: 8 }, { opt: 4, move: 6 }, { opt: 5, move: 8 }, { opt: 8, move: 0 }]
			},
			6: {
				computerOptions: [0, 8],
				humanOptions: [{ opt: 3, move: 0 }, { opt: 0, move: 8 }, { opt: 4, move: 2 }, { opt: 7, move: 8 }, { opt: 8, move: 0 }]
			},
			8: {
				computerOptions: [6, 2],
				humanOptions: [{ opt: 7, move: 6 }, { opt: 6, move: 2 }, { opt: 4, move: 0 }, { opt: 5, move: 2 }, { opt: 2, move: 6 }]
			}
		},
		    cfo = computerFirstOptions;

		//first check if computer is moving center
		if (this.centerParttern) {
			// if human has played one of my desired points
			// use that point to set two_way trap
			if (arrayHas(this.startPoints, human.moves[0])) {
				var humanFirstMove = human.moves[0],
				    lastGamePoint = gamePoints[gamePoints.length - 1];

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = gamePoints[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var game = _step2.value;

						if (game === humanFirstMove) {
							this.makeMOve(lastGamePoint);
							this.playNextTurn = this.makeThirdMove;
							return false;
						}

						lastGamePoint -= 1;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			//if the above failed, set a winningpoint for third move, it would be a two-way trap
			// if human blocks the winning point, third move would set two_way winingpoints
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = Object.keys(gameGrid)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var grid = _step3.value;
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = gameGrid[grid][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var line = _step4.value;

							if (arrayHas(line, human.moves[0]) && !arrayHas(line, this.moves[0])) {
								var two_way_trap = undefined,
								    lastGamePoint = gamePoints[gamePoints.length - 1],
								    foundMatch = false;

								while (!foundMatch) {
									var randomGamePoint = Math.round(Math.random() * (line.length - 1));

									two_way_trap = line[randomGamePoint];

									if (!arrayHas(human.moves, two_way_trap) && !arrayHas(this.moves, two_way_trap)) {
										foundMatch = true;
									}
								}

								this.winningPoints = [two_way_trap];

								var _iteratorNormalCompletion5 = true;
								var _didIteratorError5 = false;
								var _iteratorError5 = undefined;

								try {
									for (var _iterator5 = gamePoints[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
										var point = _step5.value;

										if (point === two_way_trap) {
											this.makeMOve(lastGamePoint);
											this.playNextTurn = this.makeThirdMove;
											return;
										}
										lastGamePoint -= 1;
									}
								} catch (err) {
									_didIteratorError5 = true;
									_iteratorError5 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion5 && _iterator5.return) {
											_iterator5.return();
										}
									} finally {
										if (_didIteratorError5) {
											throw _iteratorError5;
										}
									}
								}
							}
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
		}

		var _iteratorNormalCompletion6 = true;
		var _didIteratorError6 = false;
		var _iteratorError6 = undefined;

		try {
			loopComputerFirstOptions: for (var _iterator6 = Object.keys(cfo)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
				var option = _step6.value;

				if (+option === this.moves[0]) {
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = cfo[option].humanOptions[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var _option = _step7.value;

							if (_option.opt === firstHumanMove) {
								secondMove = _option.move;
								break loopComputerFirstOptions;
							} else {
								secondMove = cfo[option].computerOptions[Math.round(Math.random() * (cfo[option].computerOptions.length - 1))];
							}
						}
					} catch (err) {
						_didIteratorError7 = true;
						_iteratorError7 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion7 && _iterator7.return) {
								_iterator7.return();
							}
						} finally {
							if (_didIteratorError7) {
								throw _iteratorError7;
							}
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError6 = true;
			_iteratorError6 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion6 && _iterator6.return) {
					_iterator6.return();
				}
			} finally {
				if (_didIteratorError6) {
					throw _iteratorError6;
				}
			}
		}

		this.makeMOve(secondMove);
		this.playNextTurn = this.makeThirdMove;
	},
	makeThirdMove: function makeThirdMove() {
		var _this = this;

		var setWinnigPoints,
		    hm = human.moves,
		    tm = this.moves,
		    thirdMoveData = [{
			computerPlayed: [0, 2],
			secondMoveData: {
				winningPoint: 1,
				thirdMoveOptions: [{ opt: 4, goals: [6, 8] }, { opt: 6, goals: [3, 4] }, { opt: 8, goals: [4, 5] }],
				humanWinnngPoint: 7
			}
		}, {
			computerPlayed: [0, 6],
			secondMoveData: {
				winningPoint: 3,
				thirdMoveOptions: [{ opt: 4, goals: [2, 8] }, { opt: 2, goals: [1, 4] }, { opt: 8, goals: [4, 7] }],
				humanWinnngPoint: 5
			}
		}, {
			computerPlayed: [6, 8],
			secondMoveData: {
				winningPoint: 7,
				thirdMoveOptions: [{ opt: 4, goals: [0, 2] }, { opt: 0, goals: [3, 4] }, { opt: 2, goals: [4, 5] }],
				humanWinnngPoint: 1
			}
		}, {
			computerPlayed: [8, 2],
			secondMoveData: {
				winningPoint: 5,
				thirdMoveOptions: [{ opt: 4, goals: [0, 6] }, { opt: 0, goals: [1, 4] }, { opt: 6, goals: [4, 7] }],
				humanWinnngPoint: 3
			}
		}, {
			computerPlayed: [0, 8],
			secondMoveData: {
				humanIsMOvingCenter: true
			}
		}, {
			computerPlayed: [2, 6],
			secondMoveData: {
				humanIsMOvingCenter: true
			}
		}];

		setWinnigPoints = function () {
			_this.winningPoints = [];
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;

			try {
				gameGridSecondLoop: for (var _iterator8 = Object.keys(gameGrid)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					var grid = _step8.value;
					var _iteratorNormalCompletion9 = true;
					var _didIteratorError9 = false;
					var _iteratorError9 = undefined;

					try {
						for (var _iterator9 = gameGrid[grid][Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
							var line = _step9.value;

							if ((arrayHas(line, [tm[0], tm[2]]) || arrayHas(line, [tm[1], tm[2]])) && !arrayHas(line, hm[0]) && !arrayHas(line, hm[1]) && !arrayHas(line, hm[2])) {
								var _iteratorNormalCompletion10 = true;
								var _didIteratorError10 = false;
								var _iteratorError10 = undefined;

								try {
									for (var _iterator10 = line[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
										var val = _step10.value;

										if (!arrayHas(tm, val)) {
											_this.winningPoints.push(val);
										}
									}
								} catch (err) {
									_didIteratorError10 = true;
									_iteratorError10 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion10 && _iterator10.return) {
											_iterator10.return();
										}
									} finally {
										if (_didIteratorError10) {
											throw _iteratorError10;
										}
									}
								}
							}
						}
					} catch (err) {
						_didIteratorError9 = true;
						_iteratorError9 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion9 && _iterator9.return) {
								_iterator9.return();
							}
						} finally {
							if (_didIteratorError9) {
								throw _iteratorError9;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}

			_this.playNextTurn = _this.makeFourthMove;
		};

		//first check if computer is moving center
		if (this.centerParttern) {
			if (this.winningPoints !== undefined && !arrayHas(hm, this.winningPoints[0])) {
				this.makeMOve(this.winningPoints[0]);
				this.win();
				return;
			}

			if (this.winningPoints !== undefined && arrayHas(hm, this.winningPoints[0])) {
				var _iteratorNormalCompletion11 = true;
				var _didIteratorError11 = false;
				var _iteratorError11 = undefined;

				try {
					for (var _iterator11 = Object.keys(gameGrid)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
						var grid = _step11.value;
						var _iteratorNormalCompletion12 = true;
						var _didIteratorError12 = false;
						var _iteratorError12 = undefined;

						try {
							for (var _iterator12 = gameGrid[grid][Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
								var line = _step12.value;

								if (arrayHas(line, hm)) {
									var _iteratorNormalCompletion13 = true;
									var _didIteratorError13 = false;
									var _iteratorError13 = undefined;

									try {
										for (var _iterator13 = line[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
											var val = _step13.value;

											if (!arrayHas(hm, val)) {
												this.makeMOve(val);
											}
										}
									} catch (err) {
										_didIteratorError13 = true;
										_iteratorError13 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion13 && _iterator13.return) {
												_iterator13.return();
											}
										} finally {
											if (_didIteratorError13) {
												throw _iteratorError13;
											}
										}
									}
								}
							}
						} catch (err) {
							_didIteratorError12 = true;
							_iteratorError12 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion12 && _iterator12.return) {
									_iterator12.return();
								}
							} finally {
								if (_didIteratorError12) {
									throw _iteratorError12;
								}
							}
						}
					}

					// the above code has created two_way_points
					// empty and reset the existing winningpoints
				} catch (err) {
					_didIteratorError11 = true;
					_iteratorError11 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion11 && _iterator11.return) {
							_iterator11.return();
						}
					} finally {
						if (_didIteratorError11) {
							throw _iteratorError11;
						}
					}
				}

				this.winningPoints = [];
				var _iteratorNormalCompletion14 = true;
				var _didIteratorError14 = false;
				var _iteratorError14 = undefined;

				try {
					for (var _iterator14 = Object.keys(gameGrid)[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
						var grid = _step14.value;
						var _iteratorNormalCompletion15 = true;
						var _didIteratorError15 = false;
						var _iteratorError15 = undefined;

						try {
							for (var _iterator15 = gameGrid[grid][Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
								var line = _step15.value;

								if (arrayHas(line, tm[2])) {
									var _iteratorNormalCompletion16 = true;
									var _didIteratorError16 = false;
									var _iteratorError16 = undefined;

									try {
										for (var _iterator16 = line[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
											var val = _step16.value;

											if (!arrayHas(tm, val) && !arrayHas(hm, val)) {
												this.winningPoints.push(val);
											}
										}
									} catch (err) {
										_didIteratorError16 = true;
										_iteratorError16 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion16 && _iterator16.return) {
												_iterator16.return();
											}
										} finally {
											if (_didIteratorError16) {
												throw _iteratorError16;
											}
										}
									}
								}
							}
						} catch (err) {
							_didIteratorError15 = true;
							_iteratorError15 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion15 && _iterator15.return) {
									_iterator15.return();
								}
							} finally {
								if (_didIteratorError15) {
									throw _iteratorError15;
								}
							}
						}
					}
				} catch (err) {
					_didIteratorError14 = true;
					_iteratorError14 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion14 && _iterator14.return) {
							_iterator14.return();
						}
					} finally {
						if (_didIteratorError14) {
							throw _iteratorError14;
						}
					}
				}

				this.playNextTurn = this.makeFourthMove;
				return false;
			}

			// gotten this far? human's playing smart
			// human's played one of my desired gamePoints in his first move
			// let's see what he's upto

			// first see if he's playing on one line,
			// then block the point he hasn't played yet
			var _iteratorNormalCompletion17 = true;
			var _didIteratorError17 = false;
			var _iteratorError17 = undefined;

			try {
				gameGridLoop: for (var _iterator17 = Object.keys(gameGrid)[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
					var grid = _step17.value;
					var _iteratorNormalCompletion18 = true;
					var _didIteratorError18 = false;
					var _iteratorError18 = undefined;

					try {
						for (var _iterator18 = gameGrid[grid][Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
							var line = _step18.value;

							if (arrayHas(line, hm)) {
								var _iteratorNormalCompletion19 = true;
								var _didIteratorError19 = false;
								var _iteratorError19 = undefined;

								try {
									for (var _iterator19 = line[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
										var val = _step19.value;

										if (!arrayHas(hm, val)) {
											this.makeMOve(val);
											// hmm we've just created a two-way or a one-way point
											// set it up for the FourthMove

											setWinnigPoints();
											return false;
										}
									}
								} catch (err) {
									_didIteratorError19 = true;
									_iteratorError19 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion19 && _iterator19.return) {
											_iterator19.return();
										}
									} finally {
										if (_didIteratorError19) {
											throw _iteratorError19;
										}
									}
								}
							}
						}
					} catch (err) {
						_didIteratorError18 = true;
						_iteratorError18 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion18 && _iterator18.return) {
								_iterator18.return();
							}
						} finally {
							if (_didIteratorError18) {
								throw _iteratorError18;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError17 = true;
				_iteratorError17 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion17 && _iterator17.return) {
						_iterator17.return();
					}
				} finally {
					if (_didIteratorError17) {
						throw _iteratorError17;
					}
				}
			}
			// else, find two lines he's not but we've played from
			// then find and play the common point between the two lines
			// that would set a two-way-points

			var computer_only_lines = [];
			var _iteratorNormalCompletion20 = true;
			var _didIteratorError20 = false;
			var _iteratorError20 = undefined;

			try {
				for (var _iterator20 = Object.keys(gameGrid)[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
					var grid = _step20.value;
					var _iteratorNormalCompletion21 = true;
					var _didIteratorError21 = false;
					var _iteratorError21 = undefined;

					try {
						for (var _iterator21 = gameGrid[grid][Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
							var line = _step21.value;

							if ((arrayHas(line, tm[0]) || arrayHas(line, tm[1])) && !arrayHas(line, hm[0]) && !arrayHas(line, hm[1])) {
								computer_only_lines.push(line);
							}
						}
					} catch (err) {
						_didIteratorError21 = true;
						_iteratorError21 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion21 && _iterator21.return) {
								_iterator21.return();
							}
						} finally {
							if (_didIteratorError21) {
								throw _iteratorError21;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError20 = true;
				_iteratorError20 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion20 && _iterator20.return) {
						_iterator20.return();
					}
				} finally {
					if (_didIteratorError20) {
						throw _iteratorError20;
					}
				}
			}

			var _iteratorNormalCompletion22 = true;
			var _didIteratorError22 = false;
			var _iteratorError22 = undefined;

			try {
				for (var _iterator22 = computer_only_lines[0][Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
					var val = _step22.value;

					if (val !== 4 && (arrayHas(computer_only_lines[1], val) || arrayHas(computer_only_lines[2], val))) {
						this.makeMOve(val);
						setWinnigPoints();
						return false;
					}
				}
			} catch (err) {
				_didIteratorError22 = true;
				_iteratorError22 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion22 && _iterator22.return) {
						_iterator22.return();
					}
				} finally {
					if (_didIteratorError22) {
						throw _iteratorError22;
					}
				}
			}
		}

		var _iteratorNormalCompletion23 = true;
		var _didIteratorError23 = false;
		var _iteratorError23 = undefined;

		try {
			for (var _iterator23 = thirdMoveData[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
				var data = _step23.value;

				if (arrayHas(tm, data.computerPlayed)) {

					if (data.secondMoveData.humanIsMOvingCenter) {
						var blockedPoint = this.blockHumanCenterMove();

						// set 'two_way' winningPoints for computer's fourth move
						var _iteratorNormalCompletion24 = true;
						var _didIteratorError24 = false;
						var _iteratorError24 = undefined;

						try {
							for (var _iterator24 = this.fourthWinningOptions[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
								var option = _step24.value;

								if (option.blockedPoint === blockedPoint) {
									this.winningPoints = option.winningOptions;
									this.playNextTurn = this.makeFourthMove;
									return false;
								}
							}

							// OR set 'one_way' winningPoint if 'two_way' failed
							// first determin the row/colum where computer has made two moves
							// then, from that row/column, set the point computer has not played
						} catch (err) {
							_didIteratorError24 = true;
							_iteratorError24 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion24 && _iterator24.return) {
									_iterator24.return();
								}
							} finally {
								if (_didIteratorError24) {
									throw _iteratorError24;
								}
							}
						}

						var _iteratorNormalCompletion25 = true;
						var _didIteratorError25 = false;
						var _iteratorError25 = undefined;

						try {
							for (var _iterator25 = Object.keys(gameGrid)[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
								var grid = _step25.value;
								var _iteratorNormalCompletion26 = true;
								var _didIteratorError26 = false;
								var _iteratorError26 = undefined;

								try {
									for (var _iterator26 = gameGrid[grid][Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
										var line = _step26.value;

										if (arrayHas(line, [blockedPoint, tm[0]]) || arrayHas(line, [blockedPoint, tm[1]])) {
											var _iteratorNormalCompletion27 = true;
											var _didIteratorError27 = false;
											var _iteratorError27 = undefined;

											try {
												for (var _iterator27 = line[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
													var val = _step27.value;

													if (!arrayHas(tm, val)) {
														this.winningPoints = [val];
													}
												}
											} catch (err) {
												_didIteratorError27 = true;
												_iteratorError27 = err;
											} finally {
												try {
													if (!_iteratorNormalCompletion27 && _iterator27.return) {
														_iterator27.return();
													}
												} finally {
													if (_didIteratorError27) {
														throw _iteratorError27;
													}
												}
											}
										}
									}
								} catch (err) {
									_didIteratorError26 = true;
									_iteratorError26 = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion26 && _iterator26.return) {
											_iterator26.return();
										}
									} finally {
										if (_didIteratorError26) {
											throw _iteratorError26;
										}
									}
								}
							}
						} catch (err) {
							_didIteratorError25 = true;
							_iteratorError25 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion25 && _iterator25.return) {
									_iterator25.return();
								}
							} finally {
								if (_didIteratorError25) {
									throw _iteratorError25;
								}
							}
						}

						this.playNextTurn = this.makeFourthMove;
						return false;
					}

					if (!arrayHas(hm, data.secondMoveData.winningPoint)) {
						this.makeMOve(data.secondMoveData.winningPoint);
						this.win();
						return;
					}

					var _iteratorNormalCompletion28 = true;
					var _didIteratorError28 = false;
					var _iteratorError28 = undefined;

					try {
						for (var _iterator28 = data.secondMoveData.thirdMoveOptions[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
							var option = _step28.value;
							var opt = option.opt;

							var _option$goals = _slicedToArray(option.goals, 2);

							var goal1 = _option$goals[0];
							var goal2 = _option$goals[1];

							if (!arrayHas(hm, opt) && !arrayHas(hm, goal1) && !arrayHas(hm, goal2)) {
								this.makeMOve(opt);
								this.winningPoints = option.goals;
								this.playNextTurn = this.makeFourthMove;
								return;
							}
						}
					} catch (err) {
						_didIteratorError28 = true;
						_iteratorError28 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion28 && _iterator28.return) {
								_iterator28.return();
							}
						} finally {
							if (_didIteratorError28) {
								throw _iteratorError28;
							}
						}
					}

					this.makeMOve(data.secondMoveData.humanWinnngPoint);
					this.playNextTurn = this.makeFourthMove;
					return false;
				}
			}
		} catch (err) {
			_didIteratorError23 = true;
			_iteratorError23 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion23 && _iterator23.return) {
					_iterator23.return();
				}
			} finally {
				if (_didIteratorError23) {
					throw _iteratorError23;
				}
			}
		}
	},
	makeFourthMove: function makeFourthMove() {
		var hm = human.moves,
		    tm = this.moves;

		if (this.winningPoints) {
			var _iteratorNormalCompletion29 = true;
			var _didIteratorError29 = false;
			var _iteratorError29 = undefined;

			try {
				for (var _iterator29 = this.winningPoints[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
					var wagepoint = _step29.value;

					if (!arrayHas(hm, wagepoint)) {
						this.makeMOve(wagepoint);
						this.win();
						return;
					}
				}
			} catch (err) {
				_didIteratorError29 = true;
				_iteratorError29 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion29 && _iterator29.return) {
						_iterator29.return();
					}
				} finally {
					if (_didIteratorError29) {
						throw _iteratorError29;
					}
				}
			}
		}

		if (this.centerParttern) {
			var _iteratorNormalCompletion30 = true;
			var _didIteratorError30 = false;
			var _iteratorError30 = undefined;

			try {
				gameGridSecondLoop: for (var _iterator30 = Object.keys(gameGrid)[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
					var grid = _step30.value;
					var _iteratorNormalCompletion31 = true;
					var _didIteratorError31 = false;
					var _iteratorError31 = undefined;

					try {
						for (var _iterator31 = gameGrid[grid][Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
							var line = _step31.value;

							if (arrayHas(line, 4) && !arrayHas(hm, line[0]) && !arrayHas(hm, line[2]) && !arrayHas(tm, line[0]) && !arrayHas(tm, line[2])) {
								var randomPoint = undefined,
								    foundPoint = undefined;
								while (!foundPoint) {
									randomPoint = Math.round(Math.random() * (line.length - 1));
									if (randomPoint !== 1) {
										foundPoint = true;
									}
								}
								this.makeMOve(line[randomPoint]);
								this.playNextTurn = this.makeFifthMove;
								this.winningPoints = [];
								var wp = line[randomPoint] === line[0] ? line[2] : line[0];
								this.winningPoints = [wp];
								return;
							}
						}
					} catch (err) {
						_didIteratorError31 = true;
						_iteratorError31 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion31 && _iterator31.return) {
								_iterator31.return();
							}
						} finally {
							if (_didIteratorError31) {
								throw _iteratorError31;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError30 = true;
				_iteratorError30 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion30 && _iterator30.return) {
						_iterator30.return();
					}
				} finally {
					if (_didIteratorError30) {
						throw _iteratorError30;
					}
				}
			}
		}
		// if no winningPoints it either means human has blockd center
		// or human has played stupid
		// try to blockHumanCenterMove
		// if blockHumanCenterMove fail, find a row/column that computer
		// has played a point from it and it still has 2 free spaces
		if (!this.blockHumanCenterMove(this.makeFifthMove)) {
			var _iteratorNormalCompletion32 = true;
			var _didIteratorError32 = false;
			var _iteratorError32 = undefined;

			try {
				gameGridLoop: for (var _iterator32 = Object.keys(gameGrid)[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
					var grid = _step32.value;
					var _iteratorNormalCompletion33 = true;
					var _didIteratorError33 = false;
					var _iteratorError33 = undefined;

					try {
						gridLineLoop: for (var _iterator33 = gameGrid[grid][Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
							var line = _step33.value;

							var playedPoints = 0,
							    freePoint = undefined;
							var _iteratorNormalCompletion34 = true;
							var _didIteratorError34 = false;
							var _iteratorError34 = undefined;

							try {
								lineLoop: for (var _iterator34 = line[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
									var val = _step34.value;

									if (arrayHas(hm, val)) {
										continue gridLineLoop;
									}

									if (arrayHas(computer.moves, val)) {
										playedPoints += 1;
									} else if (freePoint === undefined) {
										freePoint = val;
									}

									if (playedPoints > 1) {
										continue gridLineLoop;
									}
								}
							} catch (err) {
								_didIteratorError34 = true;
								_iteratorError34 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion34 && _iterator34.return) {
										_iterator34.return();
									}
								} finally {
									if (_didIteratorError34) {
										throw _iteratorError34;
									}
								}
							}

							if (freePoint !== undefined) {
								computer.makeMOve(freePoint);
								this.playNextTurn = this.makeFifthMove;
								break gameGridLoop;
							}
						}
					} catch (err) {
						_didIteratorError33 = true;
						_iteratorError33 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion33 && _iterator33.return) {
								_iterator33.return();
							}
						} finally {
							if (_didIteratorError33) {
								throw _iteratorError33;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError32 = true;
				_iteratorError32 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion32 && _iterator32.return) {
						_iterator32.return();
					}
				} finally {
					if (_didIteratorError32) {
						throw _iteratorError32;
					}
				}
			}
		}
		// set winningpoint for computer' fifth move
		// find a row/colums that computer has played 2 points from it
		var _iteratorNormalCompletion35 = true;
		var _didIteratorError35 = false;
		var _iteratorError35 = undefined;

		try {
			gameGridSecondLoop: for (var _iterator35 = Object.keys(gameGrid)[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
				var grid = _step35.value;
				var _iteratorNormalCompletion36 = true;
				var _didIteratorError36 = false;
				var _iteratorError36 = undefined;

				try {
					gridLineSecondLoop: for (var _iterator36 = gameGrid[grid][Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
						var line = _step36.value;

						var playedPoints = 0,
						    freePoint = undefined;

						var _iteratorNormalCompletion37 = true;
						var _didIteratorError37 = false;
						var _iteratorError37 = undefined;

						try {
							lineSecondLoop: for (var _iterator37 = line[Symbol.iterator](), _step37; !(_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done); _iteratorNormalCompletion37 = true) {
								var val = _step37.value;

								if (arrayHas(human.moves, val)) {
									continue gridLineSecondLoop;
								}

								if (arrayHas(this.moves, val)) {
									playedPoints += 1;
								} else {
									freePoint = val;
								}
							}
						} catch (err) {
							_didIteratorError37 = true;
							_iteratorError37 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion37 && _iterator37.return) {
									_iterator37.return();
								}
							} finally {
								if (_didIteratorError37) {
									throw _iteratorError37;
								}
							}
						}

						if (freePoint !== undefined && playedPoints === 2) {
							this.winningPoints = [freePoint];
							break gameGridSecondLoop;
						}
					}
				} catch (err) {
					_didIteratorError36 = true;
					_iteratorError36 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion36 && _iterator36.return) {
							_iterator36.return();
						}
					} finally {
						if (_didIteratorError36) {
							throw _iteratorError36;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError35 = true;
			_iteratorError35 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion35 && _iterator35.return) {
					_iterator35.return();
				}
			} finally {
				if (_didIteratorError35) {
					throw _iteratorError35;
				}
			}
		}
	},
	makeFifthMove: function makeFifthMove() {
		if (this.winningPoints) {
			var _iteratorNormalCompletion38 = true;
			var _didIteratorError38 = false;
			var _iteratorError38 = undefined;

			try {
				for (var _iterator38 = this.winningPoints[Symbol.iterator](), _step38; !(_iteratorNormalCompletion38 = (_step38 = _iterator38.next()).done); _iteratorNormalCompletion38 = true) {
					var wagepoint = _step38.value;

					if (!arrayHas(human.moves, wagepoint)) {
						this.makeMOve(wagepoint);
						this.win();
						return;
					}
				}
			} catch (err) {
				_didIteratorError38 = true;
				_iteratorError38 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion38 && _iterator38.return) {
						_iterator38.return();
					}
				} finally {
					if (_didIteratorError38) {
						throw _iteratorError38;
					}
				}
			}
		}

		if (arrayHas(human.moves, computer.winningPoints)) {
			var _iteratorNormalCompletion39 = true;
			var _didIteratorError39 = false;
			var _iteratorError39 = undefined;

			try {
				for (var _iterator39 = Object.keys(gameGrid)[Symbol.iterator](), _step39; !(_iteratorNormalCompletion39 = (_step39 = _iterator39.next()).done); _iteratorNormalCompletion39 = true) {
					var grid = _step39.value;
					var _iteratorNormalCompletion40 = true;
					var _didIteratorError40 = false;
					var _iteratorError40 = undefined;

					try {
						for (var _iterator40 = gameGrid[grid][Symbol.iterator](), _step40; !(_iteratorNormalCompletion40 = (_step40 = _iterator40.next()).done); _iteratorNormalCompletion40 = true) {
							var line = _step40.value;
							var _iteratorNormalCompletion41 = true;
							var _didIteratorError41 = false;
							var _iteratorError41 = undefined;

							try {
								for (var _iterator41 = line[Symbol.iterator](), _step41; !(_iteratorNormalCompletion41 = (_step41 = _iterator41.next()).done); _iteratorNormalCompletion41 = true) {
									var val = _step41.value;

									if (!arrayHas(human.moves, val) && !arrayHas(computer.moves, val)) {
										computer.makeMOve(val);
										restartGame();
										return false;
									}
								}
							} catch (err) {
								_didIteratorError41 = true;
								_iteratorError41 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion41 && _iterator41.return) {
										_iterator41.return();
									}
								} finally {
									if (_didIteratorError41) {
										throw _iteratorError41;
									}
								}
							}
						}
					} catch (err) {
						_didIteratorError40 = true;
						_iteratorError40 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion40 && _iterator40.return) {
								_iterator40.return();
							}
						} finally {
							if (_didIteratorError40) {
								throw _iteratorError40;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError39 = true;
				_iteratorError39 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion39 && _iterator39.return) {
						_iterator39.return();
					}
				} finally {
					if (_didIteratorError39) {
						throw _iteratorError39;
					}
				}
			}
		}

		computer.makeMOve(computer.winningPoints);
		computer.win();
	},
	blockHumanCenterMove: function blockHumanCenterMove(nextTurn) {
		//human has played the center box
		//determine human's winning plan and make computer's next move
		var hm = human.moves,
		    cm = this.moves,
		    lastGame = gamePoints.length - 1;

		var _iteratorNormalCompletion42 = true;
		var _didIteratorError42 = false;
		var _iteratorError42 = undefined;

		try {
			for (var _iterator42 = gamePoints[Symbol.iterator](), _step42; !(_iteratorNormalCompletion42 = (_step42 = _iterator42.next()).done); _iteratorNormalCompletion42 = true) {
				var game = _step42.value;

				if (game !== 4 && arrayHas(hm, game) && !arrayHas(cm, lastGame)) {

					this.makeMOve(lastGame);
					if (nextTurn) {
						this.playNextTurn = nextTurn;
					}
					return lastGame;
				}
				lastGame -= 1;
			}
		} catch (err) {
			_didIteratorError42 = true;
			_iteratorError42 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion42 && _iterator42.return) {
					_iterator42.return();
				}
			} finally {
				if (_didIteratorError42) {
					throw _iteratorError42;
				}
			}
		}

		return false;
	},
	win: function win() {
		console.log('computer wins!!!');
		var winningPoints;
		var _iteratorNormalCompletion43 = true;
		var _didIteratorError43 = false;
		var _iteratorError43 = undefined;

		try {
			for (var _iterator43 = Object.keys(gameGrid)[Symbol.iterator](), _step43; !(_iteratorNormalCompletion43 = (_step43 = _iterator43.next()).done); _iteratorNormalCompletion43 = true) {
				var grid = _step43.value;
				var _iteratorNormalCompletion44 = true;
				var _didIteratorError44 = false;
				var _iteratorError44 = undefined;

				try {
					gridLineLoop: for (var _iterator44 = gameGrid[grid][Symbol.iterator](), _step44; !(_iteratorNormalCompletion44 = (_step44 = _iterator44.next()).done); _iteratorNormalCompletion44 = true) {
						var line = _step44.value;
						var _iteratorNormalCompletion45 = true;
						var _didIteratorError45 = false;
						var _iteratorError45 = undefined;

						try {
							for (var _iterator45 = line[Symbol.iterator](), _step45; !(_iteratorNormalCompletion45 = (_step45 = _iterator45.next()).done); _iteratorNormalCompletion45 = true) {
								var val = _step45.value;

								if (!arrayHas(this.moves, val)) {
									continue gridLineLoop;
								}
							}
						} catch (err) {
							_didIteratorError45 = true;
							_iteratorError45 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion45 && _iterator45.return) {
									_iterator45.return();
								}
							} finally {
								if (_didIteratorError45) {
									throw _iteratorError45;
								}
							}
						}

						winningPoints = line;
					}
				} catch (err) {
					_didIteratorError44 = true;
					_iteratorError44 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion44 && _iterator44.return) {
							_iterator44.return();
						}
					} finally {
						if (_didIteratorError44) {
							throw _iteratorError44;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError43 = true;
			_iteratorError43 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion43 && _iterator43.return) {
					_iterator43.return();
				}
			} finally {
				if (_didIteratorError43) {
					throw _iteratorError43;
				}
			}
		}

		var _iteratorNormalCompletion46 = true;
		var _didIteratorError46 = false;
		var _iteratorError46 = undefined;

		try {
			for (var _iterator46 = winningPoints[Symbol.iterator](), _step46; !(_iteratorNormalCompletion46 = (_step46 = _iterator46.next()).done); _iteratorNormalCompletion46 = true) {
				var point = _step46.value;

				$('#' + point).addClass('win');
			}
		} catch (err) {
			_didIteratorError46 = true;
			_iteratorError46 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion46 && _iterator46.return) {
					_iterator46.return();
				}
			} finally {
				if (_didIteratorError46) {
					throw _iteratorError46;
				}
			}
		}

		restartGame();
	},
	makeMOve: function makeMOve(move) {
		this.moves.push(move);

		$(jQMap.$playBox[move]).children('.symbol').text(configMap.computerSymbol || 'O');
	}
};

function restartGame() {
	setTimeout(function () {
		human.moves.length = 0;
		computer.moves.length = 0;
		computer.winningPoints = undefined;
		jQMap.$playBox.removeClass('win').children('.symbol').text('');
		computer.makeFirstMove();
	}, 2000);
}

function augmentJQMap(_jQMap) {
	if (_jQMap) {
		Object.assign(jQMap, _jQMap);
		return true;
	}

	jQMap.$playBox = $('.play-box');
	jQMap.$symbolOptions = $('.symbol-option');
}

function initApp() {
	augmentJQMap();

	// wire events
	jQMap.$symbolOptions.on('click', function () {
		var symbol = $(this).text();
		configMap.humanSymbol = symbol;
		configMap.computerSymbol = symbol === 'X' ? 'O' : 'X';
		computer.makeFirstMove();
		jQMap.$playBox.on('click', human.play);
	});

	//initGame
	$('.app-modal').modal('show');
}
$(initApp);

// make my SublimeText think we're using jQuery and bootstrap
// so it would stop showing unused variable error
jQuery, bootstrap;

},{"bootstrap":2,"jquery":3}],2:[function(require,module,exports){
(function (global){

; jQuery = global.jQuery = require("jquery");
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/*!
 * Bootstrap v3.3.5 (https://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery');
}

+(function ($) {
  'use strict';

  var version = $.fn.jquery.split(' ')[0].split('.');
  if (version[0] < 2 && version[1] < 9 || version[0] == 1 && version[1] == 9 && version[2] < 1) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher');
  }
})(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * https://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // CSS TRANSITION SUPPORT (Shoutout: https://www.modernizr.com/)
  // ============================================================

  ;
  function transitionEnd() {
    var el = document.createElement('bootstrap');

    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] };
      }
    }

    return false; // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;
    var $el = this;
    $(this).one('bsTransitionEnd', function () {
      called = true;
    });
    var callback = function callback() {
      if (!called) $($el).trigger($.support.transition.end);
    };
    setTimeout(callback, duration);
    return this;
  };

  $(function () {
    $.support.transition = transitionEnd();

    if (!$.support.transition) return;

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function handle(e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
      }
    };
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * https://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // ALERT CLASS DEFINITION
  // ======================

  ;
  var dismiss = '[data-dismiss="alert"]';
  var Alert = function Alert(el) {
    $(el).on('click', dismiss, this.close);
  };

  Alert.VERSION = '3.3.5';

  Alert.TRANSITION_DURATION = 150;

  Alert.prototype.close = function (e) {
    var $this = $(this);
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = $(selector);

    if (e) e.preventDefault();

    if (!$parent.length) {
      $parent = $this.closest('.alert');
    }

    $parent.trigger(e = $.Event('close.bs.alert'));

    if (e.isDefaultPrevented()) return;

    $parent.removeClass('in');

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove();
    }

    $.support.transition && $parent.hasClass('fade') ? $parent.one('bsTransitionEnd', removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
  };

  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.alert');

      if (!data) $this.data('bs.alert', data = new Alert(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.alert;

  $.fn.alert = Plugin;
  $.fn.alert.Constructor = Alert;

  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old;
    return this;
  };

  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close);
})(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * https://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  ;
  var Button = function Button(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Button.DEFAULTS, options);
    this.isLoading = false;
  };

  Button.VERSION = '3.3.5';

  Button.DEFAULTS = {
    loadingText: 'loading...'
  };

  Button.prototype.setState = function (state) {
    var d = 'disabled';
    var $el = this.$element;
    var val = $el.is('input') ? 'val' : 'html';
    var data = $el.data();

    state += 'Text';

    if (data.resetText == null) $el.data('resetText', $el[val]());

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state]);

      if (state == 'loadingText') {
        this.isLoading = true;
        $el.addClass(d).attr(d, d);
      } else if (this.isLoading) {
        this.isLoading = false;
        $el.removeClass(d).removeAttr(d);
      }
    }, this), 0);
  };

  Button.prototype.toggle = function () {
    var changed = true;
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    if ($parent.length) {
      var $input = this.$element.find('input');
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false;
        $parent.find('.active').removeClass('active');
        this.$element.addClass('active');
      } else if ($input.prop('type') == 'checkbox') {
        if ($input.prop('checked') !== this.$element.hasClass('active')) changed = false;
        this.$element.toggleClass('active');
      }
      $input.prop('checked', this.$element.hasClass('active'));
      if (changed) $input.trigger('change');
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));
      this.$element.toggleClass('active');
    }
  };

  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.button');
      var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option;

      if (!data) $this.data('bs.button', data = new Button(this, options));

      if (option == 'toggle') data.toggle();else if (option) data.setState(option);
    });
  }

  var old = $.fn.button;

  $.fn.button = Plugin;
  $.fn.button.Constructor = Button;

  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old;
    return this;
  };

  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target);
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
    Plugin.call($btn, 'toggle');
    if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault();
  }).on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type));
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * https://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // CAROUSEL CLASS DEFINITION
  // =========================

  ;
  var Carousel = function Carousel(element, options) {
    this.$element = $(element);
    this.$indicators = this.$element.find('.carousel-indicators');
    this.options = options;
    this.paused = null;
    this.sliding = null;
    this.interval = null;
    this.$active = null;
    this.$items = null;

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.carousel', $.proxy(this.pause, this)).on('mouseleave.bs.carousel', $.proxy(this.cycle, this));
  };

  Carousel.VERSION = '3.3.5';

  Carousel.TRANSITION_DURATION = 600;

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  };

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37:
        this.prev();break;
      case 39:
        this.next();break;
      default:
        return;
    }

    e.preventDefault();
  };

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);

    this.interval && clearInterval(this.interval);

    this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this;
  };

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');
    return this.$items.index(item || this.$active);
  };

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    var willWrap = direction == 'prev' && activeIndex === 0 || direction == 'next' && activeIndex == this.$items.length - 1;
    if (willWrap && !this.options.wrap) return active;
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;
    return this.$items.eq(itemIndex);
  };

  Carousel.prototype.to = function (pos) {
    var that = this;
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

    if (pos > this.$items.length - 1 || pos < 0) return;

    if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
      that.to(pos);
    }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
  };

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true);

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end);
      this.cycle(true);
    }

    this.interval = clearInterval(this.interval);

    return this;
  };

  Carousel.prototype.next = function () {
    if (this.sliding) return;
    return this.slide('next');
  };

  Carousel.prototype.prev = function () {
    if (this.sliding) return;
    return this.slide('prev');
  };

  Carousel.prototype.slide = function (type, next) {
    var $active = this.$element.find('.item.active');
    var $next = next || this.getItemForDirection(type, $active);
    var isCycling = this.interval;
    var direction = type == 'next' ? 'left' : 'right';
    var that = this;

    if ($next.hasClass('active')) return this.sliding = false;

    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;

    this.sliding = true;

    isCycling && this.pause();

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active');
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active');
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type);
      $next[0].offsetWidth; // force reflow
      $active.addClass(direction);
      $next.addClass(direction);
      $active.one('bsTransitionEnd', function () {
        $next.removeClass([type, direction].join(' ')).addClass('active');
        $active.removeClass(['active', direction].join(' '));
        that.sliding = false;
        setTimeout(function () {
          that.$element.trigger(slidEvent);
        }, 0);
      }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
    } else {
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      this.$element.trigger(slidEvent);
    }

    isCycling && this.cycle();

    return this;
  };

  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.carousel');
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
      var action = typeof option == 'string' ? option : options.slide;

      if (!data) $this.data('bs.carousel', data = new Carousel(this, options));
      if (typeof option == 'number') data.to(option);else if (action) data[action]();else if (options.interval) data.pause().cycle();
    });
  }

  var old = $.fn.carousel;

  $.fn.carousel = Plugin;
  $.fn.carousel.Constructor = Carousel;

  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;
    return this;
  };

  // CAROUSEL DATA-API
  // =================

  var clickHandler = function clickHandler(e) {
    var href;
    var $this = $(this);
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    if (!$target.hasClass('carousel')) return;
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');
    if (slideIndex) options.interval = false;

    Plugin.call($target, options);

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex);
    }

    e.preventDefault();
  };

  $(document).on('click.bs.carousel.data-api', '[data-slide]', clickHandler).on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data());
    });
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * https://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  ;
  var Collapse = function Collapse(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent();
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger);
    }

    if (this.options.toggle) this.toggle();
  };

  Collapse.VERSION = '3.3.5';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height';
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return;
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null);
    }

    var dimension = this.dimension();

    this.$element.removeClass('collapse').addClass('collapsing')[dimension](0).attr('aria-expanded', true);

    this.$trigger.removeClass('collapsed').attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function complete() {
      this.$element.removeClass('collapsing').addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element.trigger('shown.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element.one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element.addClass('collapsing').removeClass('collapse in').attr('aria-expanded', false);

    this.$trigger.addClass('collapsed').attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function complete() {
      this.transitioning = 0;
      this.$element.removeClass('collapsing').addClass('collapse').trigger('hidden.bs.collapse');
    };

    if (!$.support.transition) return complete.call(this);

    this.$element[dimension](0).one('bsTransitionEnd', $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']();
  };

  Collapse.prototype.getParent = function () {
    return $(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function (i, element) {
      var $element = $(element);
      this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
    }, this)).end();
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger.toggleClass('collapsed', !isOpen).attr('aria-expanded', isOpen);
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target') || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(target);
  }

  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', data = new Collapse(this, options));
      if (typeof option == 'string') data[option]();
    });
  }

  var old = $.fn.collapse;

  $.fn.collapse = Plugin;
  $.fn.collapse.Constructor = Collapse;

  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this;
  };

  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data = $target.data('bs.collapse');
    var option = data ? 'toggle' : $this.data();

    Plugin.call($target, option);
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * https://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // DROPDOWN CLASS DEFINITION
  // =========================

  ;
  var backdrop = '.dropdown-backdrop';
  var toggle = '[data-toggle="dropdown"]';
  var Dropdown = function Dropdown(element) {
    $(element).on('click.bs.dropdown', this.toggle);
  };

  Dropdown.VERSION = '3.3.5';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this = $(this);
      var $parent = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
    });
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div')).addClass('dropdown-backdrop').insertAfter($(this)).on('click', clearMenus);
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.trigger('focus').attr('aria-expanded', 'true');

      $parent.toggleClass('open').trigger('shown.bs.dropdown', relatedTarget);
    }

    return false;
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click');
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0) index--; // up
    if (e.which == 40 && index < $items.length - 1) index++; // down
    if (! ~index) index = 0;

    $items.eq(index).trigger('focus');
  };

  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', data = new Dropdown(this));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdown;

  $.fn.dropdown = Plugin;
  $.fn.dropdown.Constructor = Dropdown;

  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this;
  };

  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document).on('click.bs.dropdown.data-api', clearMenus).on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
    e.stopPropagation();
  }).on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle).on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown).on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown);
})(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * https://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // MODAL CLASS DEFINITION
  // ======================

  ;
  var Modal = function Modal(element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.$dialog = this.$element.find('.modal-dialog');
    this.$backdrop = null;
    this.isShown = null;
    this.originalBodyPad = null;
    this.scrollbarWidth = 0;
    this.ignoreBackdropClick = false;

    if (this.options.remote) {
      this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () {
        this.$element.trigger('loaded.bs.modal');
      }, this));
    }
  };

  Modal.VERSION = '3.3.5';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget);
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
      });
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body); // don't move modals dom position
      }

      that.$element.show().scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth; // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ? that.$dialog // wait for modal to slide in
      .one('bsTransitionEnd', function () {
        that.$element.trigger('focus').trigger(e);
      }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger('focus').trigger(e);
    });
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element.removeClass('in').off('click.dismiss.bs.modal').off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ? this.$element.one('bsTransitionEnd', $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
  };

  Modal.prototype.enforceFocus = function () {
    $(document).off('focusin.bs.modal') // guard against infinite focus loop
    .on('focusin.bs.modal', $.proxy(function (e) {
      if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
        this.$element.trigger('focus');
      }
    }, this));
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide();
      }, this));
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal');
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this));
    } else {
      $(window).off('resize.bs.modal');
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal');
    });
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null;
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div')).addClass('modal-backdrop ' + animate).appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return;
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static' ? this.$element[0].focus() : this.hide();
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ? this.$backdrop.one('bsTransitionEnd', callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function callbackRemove() {
        that.removeBackdrop();
        callback && callback();
      };
      $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one('bsTransitionEnd', callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
    } else if (callback) {
      callback();
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog();
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    });
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    });
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
      // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar();
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt(this.$body.css('padding-right') || 0, 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad);
  };

  Modal.prototype.measureScrollbar = function () {
    // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth;
  };

  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);

      if (!data) $this.data('bs.modal', data = new Modal(this, options));
      if (typeof option == 'string') data[option](_relatedTarget);else if (options.show) data.show(_relatedTarget);
    });
  }

  var old = $.fn.modal;

  $.fn.modal = Plugin;
  $.fn.modal.Constructor = Modal;

  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this;
  };

  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this);
    var href = $this.attr('href');
    var $target = $($this.attr('data-target') || href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus');
      });
    });
    Plugin.call($target, option, this);
  });
})(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * https://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+(function ($) {
  'use strict'

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  ;
  var Tooltip = function Tooltip(element, options) {
    this.type = null;
    this.options = null;
    this.enabled = null;
    this.timeout = null;
    this.hoverState = null;
    this.$element = null;
    this.inState = null;

    this.init('tooltip', element, options);
  };

  Tooltip.VERSION = '3.3.5';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled = true;
    this.type = type;
    this.$element = $(element);
    this.options = this.getOptions(options);
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
    this.inState = { click: false, hover: false, focus: false };

    if (_instanceof(this.$element[0], document.constructor) && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!');
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
      } else if (trigger != 'manual') {
        var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this));
      }
    }

    this.options.selector ? this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' }) : this.fixTitle();
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS;
  };

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      };
    }

    return options;
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value;
    });

    return options;
  };

  Tooltip.prototype.enter = function (obj) {
    var self = _instanceof(obj, this.constructor) ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (_instanceof(obj, $.Event)) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true;
    }

    if (self.terState = 'in';
      return;
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show();
    }, self.options.delay.show);
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true;
    }

    return false;
  };

  Tooltip.prototype.leave = function (obj) {
    var self = _instanceof(obj, this.constructor) ? obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self);
    }

    if (_instanceof(obj, $.Event)) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false;
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.deip().hasClass('in') || self.hoverState == 'in') {
      self.hov
