$(document).ready(function () {

    const EmTapp = {
        appName: "EmTapp-Core",
        app: this,
        synth: new Tone.Synth().toMaster(),
        polySynth: new Tone.PolySynth(2, Tone.Synth).toMaster(),
        pitchClassArr: [["C", 0], ["D", 2], ["E", 4], ["F", 5], ["G", 7], ["A", 9], ["B", 11]],
        lettersArr: ["C", "D", "E", "F", "G", "A", "B"],
        intervalArr: [],//ordered list of objects (for randomization)
        buildInterval: {
            app: this,
            pClassArr: [["C", 0], ["D", 2], ["E", 4], ["F", 5], ["G", 7], ["A", 9], ["B", 11]],
            letters: ["C", "D", "E", "F", "G", "A", "B"],
            interval: {},
            intervalArr: [],//ordered list of objects (for randomization)
            toPitchClass: function (n) {//converts note name to pitch class
                let pc = -1;
                let index = 0;
                while (pc === -1) {//finds pc of letter name
                    if (n[0] === this.pClassArr[index][0]) {
                        pc = this.pClassArr[index][1];
                    } else {
                        index += 1;
                    };
                };
                if (n.length === 1) {//if no accidentals, we're done 
                    return pc;
                };
                for (let c = 1; c < n.length; c += 1) {
                    switch (n[c]) {//adjust based on accidentals
                        case "#":
                            pc += 1;
                            break;
                        case "b":
                            pc -= 1;
                            break;
                        case "X":
                            pc += 2;
                            break;
                    };
                };
                if (pc >= 12) {
                    pc -= 12;
                };
                if (pc < 0) {
                    pc += 12;
                };
                return pc;
            },
            getOctave: function (str) {//takes string, returns the octave
                let octave;
                let lastChar = str.charCodeAt(str.length - 1);
                if ((lastChar >= 48 && lastChar <= 57)) {
                    octave = lastChar;
                } else {
                    octave = 4;
                };
                return octave;
            },
            removeOctave: function (str) {//takes a name and if their is an octave designation, it removes it.
                let lastCharStr = str.charCodeAt(str.length - 1);
                if (lastCharStr >= 48 && lastCharStr <= 57) {
                    return str.substr(0, str.length - 1);
                } else {
                    return str;
                };
            },
            getHalfSteps: function (l, u) {// method counts number of half steps
                let lowerO = this.getOctave(l);
                let upperO = this.getOctave(u);
                l = this.removeOctave(l);
                u - this.removeOctave(u);
                let toPitchClass = this.toPitchClass;
                let lpc = this.toPitchClass(l);
                let upc = this.toPitchClass(u);
                let octaveDifference = upperO - lowerO;
                if (octaveDifference > 0) {
                    upc += (octaveDifference * 12);
                };
                let halfSteps = upc - lpc;
                if (halfSteps < 0)
                    halfSteps += 12;
                return halfSteps;
            },
            toInterval: function (l, u) {//calculates interval between two notes
                l = this.removeOctave(l);
                u - this.removeOctave(u);
                let int = ""; //That one is too hard!
                let uIndex = this.letters.indexOf(u[0]);
                let lIndex = this.letters.indexOf(l[0]);
                let num = uIndex - lIndex + 1;
                if (num <= 0) { num += 7 };
                let halfSteps = this.getHalfSteps(l, u);
                switch (num) {
                    case 2://qualities of 2nds(done)
                        switch (halfSteps) {
                            case 0:
                                int = this.interval.d2;
                                break;
                            case 1:
                                int = this.interval.m2;
                                break;
                            case 2:
                                int = this.interval.M2;;
                                break;
                            case 3:
                                int = this.interval.A2;;
                                break;
                        };
                        break;
                    case 3://qualities of 3rds(done)
                        switch (halfSteps) {
                            case 2:
                                int = this.interval.d3;;
                                break;
                            case 3:
                                int = this.interval.m3;
                                break;
                            case 4:
                                int = this.interval.M3;
                                break;
                            case 5:
                                int = this.interval.A3;
                                break;
                        }
                        break;
                    case 4://qualities of fourths(done)
                        switch (halfSteps) {
                            case 4:
                                int = this.interval.d4;
                                break;
                            case 5:
                                int = this.interval.P4;
                                break;
                            case 6:
                                int = this.interval.A4;
                                break;
                            case 7:
                                int = this.interval.AA4;
                        };
                        break;
                    case 5://qualities of 5ths(done)
                        switch (halfSteps) {
                            case 6:
                                int = this.interval.d5;
                                break;
                            case 7:
                                int = this.interval.P5;
                                break;
                            case 8:
                                int = this.interval.A5;
                                break;
                        }
                        break;
                    case 6://qualities of 6ths(done)
                        switch (halfSteps) {
                            case 7:
                                int = this.interval.d6;;
                                break;
                            case 8:
                                int = this.interval.m6
                                break;
                            case 9:
                                int = this.interval.M6;
                                break;
                            case 10:
                                int = this.interval.A6;
                                break;
                        }
                        break;
                    case 7://qualities of 7ths 
                        switch (halfSteps) {
                            case 9:
                                int = this.interval.d7;
                                break;
                            case 10:
                                int = this.interval.m7;
                                break;
                            case 11:
                                int = this.interval.M7;
                                break;
                            case 0://HACK: 12 half steps is coming out as zero because of measureHalfSteps function
                                int = this.interval.A7;
                                break;
                        };
                        break;
                    case 1://qualities of 8ths
                        //HACK: used 1 because of how we caculate the number. 
                        //as is, this function can't calculate unisons
                        switch (halfSteps) {
                            case 11:
                                int = this.interval.d8;
                                break;
                            case 0:
                                int = this.interval.P8;
                                break;
                            case 1:
                                int = this.interval.A8;
                                break;
                        }
                        break;
                };
                return int;
            },
        },
        randNote: function () {
            let app = this;
            const getRandom = function () {
                let letters = app.lettersArr;
                let note;
                let r = Math.floor(Math.random() * 7);
                let result = letters[r];
                let accidentals = ["", "#", "b"];
                r = Math.floor(Math.random() * 3);
                result += accidentals[r];
                return result;
            };
            const getFilteredRandom = function () {
                let result = getRandom();
                const rareList = ["B#", "E#", "Cb", "Fb", "A#", "G#", "D#"];
                if (rareList.indexOf(result) === -1) {
                    return result;
                } else {
                    let count = 0;
                    while (rareList.indexOf(result) !== -1 && count < 2) {
                        result = getRandom();
                        count += 1;
                    };
                    return result;
                };
            };
            return getFilteredRandom();
        },
        randInterval: function () {
            let x = this.intervalArr;
            let r = Math.floor(Math.random() * x.length);
            return x[r];
        },
        randIntervalObject: function () {
            let interval = this.randInterval();
            let lower = this.randNote();
            let upper = interval.upFrom(lower);
            let lowerPClass = this.buildInterval.toPitchClass(lower);
            let upperPClass = this.buildInterval.toPitchClass(upper);
            console.log("upper: " + upperPClass);
            console.log("lower: " + lowerPClass);
  
             //lower is B#==
            if (lower === "B#" || lower ==="B") {
                lower += "3";
                upper += "4";
            } else if (lower === "Cb") {
                lower += "4";
                upper += "4";
            } else if (upper === "Cb" || upper ==="B#") {
                lower += "4";
                upper += "5";
            } else if (upperPClass > lowerPClass) {
                lower += "4";
                upper += "4";
            } else if (lowerPClass >= upperPClass) {
                lower += "4";
                upper += "5";
            };
            return [lower, upper, interval.fullName];
        },
        setUp: function () {
            const app = this;
            const letters = this.lettersArr;
            const setUpIntervals = function () {
                const Int = function (fullName, abr, numHalfSteps) {//creates interval objects;
                    this.fullName = fullName;
                    this.abr = abr;
                    this.numHalfSteps = numHalfSteps;
                    let thisInt = this;
                    this.upFrom = function (lower) {// l = lower note in form "C#
                        let lNum = letters.indexOf(lower[0]);//calculating interval number
                        let uNum = lNum + parseInt(abr[abr.length - 1] - 1);//lNum and hNum= index in letters
                        if (uNum >= 7) { uNum -= 7 }; //if index of answer > 7, wrap around
                        let upper = letters[uNum];//translate hNum to letter name
                        let int = app.buildInterval.toInterval(lower, upper);//interval l and result, in form of object
                        const adjustUp = function (n) {//adjusts note n up by half step
                            if (!n.endsWith("#") && !n.endsWith("b") && !n.endsWith("X")) {
                                n += "#";
                            } else if (n.endsWith("#")) {
                                n = n.replace("#", "X");
                            } else if (n.endsWith("b")) {
                                n = n.substr(0, n.length - 1);
                            } else if (n.endsWith("X")) {
                                n += "#";
                            }
                            return n;
                        };
                        const adjustDown = function (n) {//adjusts note n up by half step
                            if (!n.endsWith("#") && !n.endsWith("b") && !n.endsWith("X")) {
                                n += "b";
                            } else if (n.endsWith("#")) {
                                n = n.substr(0, n.length - 1);
                            } else if (n.endsWith("X")) {
                                n = n.replace("X", "#");
                            } else if (n.endsWith("b")) {
                                n += "b";
                            };
                            return n;
                        };
                        //adjust result until the interval is right
                        let counter = 0;

                        while (int.numHalfSteps !== thisInt.numHalfSteps) {//compares current int to this interval
                            if (int.numHalfSteps < thisInt.numHalfSteps) {//if the interval is too small
                                upper = adjustUp(upper);
                            } else if (int.numHalfSteps > thisInt.numHalfSteps) {//if the interval is too big
                                upper = adjustDown(upper);
                            };
                            int = app.buildInterval.toInterval(lower, upper);
                            counter += 1;
                            if (counter > 25) {
                                console.log("ERROR:  problem with while loop in upFrom");
                                break;
                            }
                        };
                        return upper;
                    };
                };
                const interval = app.buildInterval.interval;
                interval.d2 = new Int("Diminished Second", "d2", 0);
                interval.m2 = new Int("Minor Second", "m2", 1);
                interval.M2 = new Int("Major Second", "M2", 2);
                interval.d2 = new Int("Diminished Second", "d2", 0);
                interval.m2 = new Int("Minor Second", "m2", 1);
                interval.M2 = new Int("Major Second", "M2", 2);
                interval.A2 = new Int("Augmented Second", "A2", 3);
                interval.d3 = new Int("Diminished Third", "d3", 2);
                interval.m3 = new Int("Minor Third", "m3", 3);
                interval.M3 = new Int("Major Third", "M3", 4);
                interval.A3 = new Int("Augmented Third", "A3", 5);
                interval.d4 = new Int("Diminished Fourth", "d4", 4);
                interval.P4 = new Int("Perfect Fourth", "P4", 5);
                interval.A4 = new Int("Augmented Fourth", "A4", 6);
                interval.AA4 = new Int("Doubly Augmented Fourth", "AA4", 7);
                interval.d5 = new Int("Diminished Fifth", "d5", 6);
                interval.P5 = new Int("Perfect Fifth", "P5", 7);
                interval.A5 = new Int("Augmented Fifth", "A5", 8);
                interval.d6 = new Int("Diminished Sixth", "d6", 7);
                interval.m6 = new Int("Minor Sixth", "m6", 8);
                interval.M6 = new Int("Major Sixth", "M6", 9);
                interval.A6 = new Int("Augmented Sixth", "A6", 10);
                interval.d7 = new Int("Diminished Seventh", "d7", 9);
                interval.m7 = new Int("Minor Seventh", "m7", 10);
                interval.M7 = new Int("Major Seventh", "M7", 11);
                interval.A7 = new Int("Augmented Seventh", "A7", 12);
                interval.d8 = new Int("Diminished Octave", "d8", 11);
                interval.P8 = new Int("Perfect Octave", "P8", 12);
                interval.A8 = new Int("Augmented Octave", "A8", 13);
            };
            const setUpIntervalArr = function () {
                //const app = this.app;
                let abreviation;
                const intervalObjects = app.buildInterval.interval;
                for (let interval in intervalObjects) {
                    if (!intervalObjects.hasOwnProperty(interval)) continue;

                    abreviation = intervalObjects[interval].abr;
                    const filtered = ["A8", "d2", "d8", "d3", "d4", "A2", "A3", "AA4", "A5", "d6", "A6", "d7", "A7"];
                    if (filtered.indexOf(abreviation) === -1) {//push ints that aren't on list to Arr
                        //filtering out intervals that are less common
                        app.intervalArr.push(app.buildInterval.interval[abreviation]);
                    };
                };
            };
            setUpIntervals();
            setUpIntervalArr();
        },
        restartTransport: function (updatedNumVoices) {
            if (Tone.Transport.state === "started") {
                Tone.Transport.stop(Tone.now());
            };
            this.synth.dispose();
            this.polySynth.dispose();
            this.synth = new Tone.Synth().toMaster();
            this.polySynth = new Tone.PolySynth(updatedNumVoices, Tone.Synth).toMaster();
        },
        playSeries: function (arr, callback, playTogether = true) {
            this.restartTransport(arr.length);
            let that = this;
            let now;
            let note;
            let delay = 0;
            let delayIncrement = .9;
            let duration = .8;
            for (let i = 0; i < arr.length; i += 1) {
                now = Tone.now();
                Tone.Transport.scheduleOnce(function (now) {
                    note = arr[i];
                    that.synth.triggerAttackRelease(note, duration);
                }, delay);
                delay += 1;
            };
            if (playTogether === true) {
                this.numVoices = arr.length;
                Tone.Transport.scheduleOnce(function (now) {
                    that.polySynth.triggerAttackRelease(arr, duration + .5);
                }, delay);
                delay += 2;
            };
            Tone.Transport.scheduleOnce(function () {
                callback();
            }, delay);
            Tone.Transport.start(now + .1);
            Tone.Transport.stop(now + delay + 1);
           
            return;
        },
        nerdSpeech: window.speechSynthesis, 
        nerdUtterance: {},
        updateNerdUtterance: function (utterance) {
            this.nerdUtterance = new SpeechSynthesisUtterance(utterance);
        },
        nerdIntro: ["Greetings, fellow Nerds!",
                    "I am the Music Theory Nerd!",
                    "Let's name some intervals.",
                    "I'll play each interval twice, and then give the answer.",
                    "Get ready! Here we go..."
        ],
        speakNerdIntro: function (callback) {
            const app = this;
            let phrases = this.nerdIntro;
            let nerdWords = $("#nerd-words");
            let counter = 0;
            let stopped = false;
            let speakText = function () {
                if (stopped === true) {
                    return;
                };
                $("#start").on("click", function () {
                    stopped = true;
                });
                app.updateNerdUtterance(phrases[counter]);
                msg = app.nerdUtterance;
                
                if (counter === phrases.length - 1) {
                    msg.onend = function () {
                        $("#nerd-box").hide(500);
                        callback();
                    };
                } else {
                    msg.onend = ()=> {
                        counter += 1;
                        speakText();
                    };
                };
                app.nerdSpeech.speak(msg);
                nerdWords.html("<h2>" + phrases[counter] + "</h2>");
            };
            $("#nerd-box").show(2000, () => {
                speakText();
            });
        },
        playIntervals: function(num) {
            let app = this;
            let countdown = num ;
            let info, lower, upper;
            let playTwice = function ([lower, upper], callback) {
                app.playSeries([lower, upper], function () {
                    setTimeout(function () {
                        app.playSeries([lower, upper], callback);
                    }, 2000);
                });
            };
            let stopped = false;
            const recursive = function () {   
                $("#start").on("click", function () {
                    stopped = true;
                });
                if (stopped === true) {
                    return;
                }
                console.log("recursive called, counter: " + countdown);
                if (countdown === 1) {
                    info = app.randIntervalObject();
                    lower = info[0];
                    upper = info[1];
                    console.log("counter: " +countdown);
                    console.log("info: " + info);

                    playTwice([lower, upper], function () {
                        app.nerdGiveAnswer(info[2], function () {
                            $("#intervals-left").html("Finished!");
                            console.log("intervals finished");
                        });///intervals fullName                
                    });
                    return;
                } else {
                    info = app.randIntervalObject();
                    lower = info[0];
                    upper = info[1];
                    console.log("countdown: " + countdown);
                    console.log("info: " + info);
                    playTwice([lower, upper], function () {
                        countdown -= 1;
                        app.nerdGiveAnswer(info[2], function () {
                            $("#intervals-left").html(countdown);
                            recursive();
                        });//intervals fullName
                    });
                };
            };
            recursive();
        },
        summonNerd: function () {
            this.speakNerdIntro( () => {
                console.log("The nerd has spoken");
            });
        },
        nerdGiveAnswer: function (intervalName, callback) {//{fullName, lower, upper}
            const app = this;
            let nerdBox = $("#nerd-box");
            let nerdWords = $("#nerd-words");
            let answerString = "The answer is: " + intervalName;
            app.updateNerdUtterance(answerString);
            let answer = app.nerdUtterance;
            const onShowNerd = function () {
                nerdWords.html("<h2>" + answerString + "</h2>");
                app.nerdSpeech.speak(answer);
            };
            answer.onend = function () {
                console.log("ended");
                nerdBox.hide(500, callback);
            };
            nerdWords.html("");
            nerdBox.show(2000, onShowNerd);               
        },
        addStopEventListener: function () {
            const app = this;
            const btn = $("#start");
            btn.html("stop");
            const listener = function () {
                console.log("stop event triggered");
                $("#nerd-box").hide();
                app.restartTransport();
                app.nerdSpeech.cancel();
                app.addStartEventListener();
            };
            btn.one("click", listener);
        },
        addStartEventListener: function () {
            const app = this;
            const btn = $("#start");
            $("#answer").html("");
            $("#nerd-words").html("");
            btn.html("start");
            const listener = function () {
                console.log("start event triggered");
                app.addStopEventListener();
                app.speakNerdIntro(function () {
                    app.playIntervals(25);
                });
            };
            btn.one("click", listener);
        },
        start: function () {
            let app = this;
            $("#answer").hide();
            $("#nerd-box").hide();
            app.setUp();
            app.addStartEventListener();
        }        
    };

    EmTapp.setUp();
    EmTapp.start();

});
