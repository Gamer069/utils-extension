(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error("This extension must be ran unsandboxed.");
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    var runTimer = 0;
    let ipCache;
    let ele = document.createElement('input')
    let crypto = document.createElement("script")
    crypto.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"
    document.body.append(crypto)
    class UtilsExtension {
        constructor() {
            runtime.on("PROJECT_START", () => {
                runTimer = 0;
            });
            runtime.on("PROJECT_STOP_ALL", () => {
                runTimer = 0;
                if (runtime.shouldExecuteStopClicked)
                    queueMicrotask(() =>
                        runtime.startHats("utils_whenStopClicked")
                    );
            });
            runtime.on("BEFORE_EXECUTE", () => {
                runtime.startHats("utils_whenAlways")
            });
            runtime.on("AFTER_EXECUTE", () => {
                runtime.shouldExecuteStopClicked = true;
            });
            const originalGreenFlag = vm.greenFlag;
            vm.greenFlag = function () {
                runtime.shouldExecuteStopClicked = false;
                originalGreenFlag.call(this);
            };
        }
        getInfo() {
            return {
                id: "utils",
                name: "Utils",
                color1: "#A020D0",
                color2: "#FF0000",
                color3: "#FFA500",
                blocks: [
                    {
                        opcode: "whenStopClicked",
                        blockType: Scratch.BlockType.EVENT,
                        text: "when [STOP] clicked",
                        isEdgeActivated: false,
                        arguments: {
                            STOP: {
                                type: Scratch.ArgumentType.IMAGE,
                                dataURI: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAQlBMVEUAAAC/UFC8Q0OzTU24SEi4SEi3SEi4R0e4SEi4SEi4SEi4SEi7SUm8SUnMTk7MT0/OT0/PT0/gVVXiVVXsWVn///+CoOd2AAAAC3RSTlMAEBMUu7zLz9D8/dIXnJwAAAABYktHRBXl2PmjAAAAxklEQVRIx+3WwRKDIBAD0JWqVEOtWv7/W3twOqKwELzW3N9wYhORMMYiztgZUZMUAKxqmh5Kno/MG256nzI59Z2mB+BWH+XzUt5RhWoyQjFZkTQFkTBFERlCnAwlDoYUgaHFblpaeL86AK0MvNjMIABmT2cGIAAWniw3ucm/k9ovduEjXzgXtUfJmtrTt9VZzYH9FSB/xvfKZMsiLFmuko61zBTfucjL9RpXf6nEU2MhPxXS86J+kORmjz6V6seViOnG8oT7ApMcjsYZwhXCAAAAAElFTkSuQmCC"
                            }
                        },
                        extensions: ["colours_event"]
                    },
                    {
                        opcode: "whenAlways",
                        blockType: Scratch.BlockType.EVENT,
                        text: "always",
                        isEdgeActivated: false,
                        extensions: ["colours_event"]
                    },
                    "---",
                    {
                        opcode: "aiPrompt",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "prompt [string] with api key [apiKey] to [model] with temperature [temperature]",
                        arguments: {
                            string: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "what is the best programming language to learn in 2023?"
                            },
                            model: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "MODEL_MENU"
                            },
                            temperature: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                                min: 0,
                                max: 2
                            },
                            apiKey: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<YOUR API KEY HERE>"
                            }
                        },
                    },
                    {
                        opcode: "stt",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "speech-to-text"
                    },
                    {
                        opcode: "encryptPBKDF2",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "PBKDF2 encrypt [txt] with password [pass]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            pass: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "request",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[method] request [url] with body params [bodyParams], header params [headerParams]",
                        arguments: {
                            method: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "METHOD_MENU"
                            },
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "https://api.quotable.io/random"
                            },
                            bodyParams: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            headerParams: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "convert",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "convert [cfg] to [fmt]",
                        arguments: {
                            cfg: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            fmt: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "FMT_MENU"
                            }
                        }
                    },
                    {
                        opcode: "objectOf",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "object [field] of [obj]",
                        arguments: {
                            field: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            obj: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },
                    {
                        opcode: "toCase",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "convert [str] to [strCase]",
                        arguments: {
                            strCase: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "CASE_MENU"
                            },
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello, World!"
                            }
                        }
                    },
                    {
                        opcode: "replace",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "replace [find] with [replace] in [str]",
                        arguments: {
                            find: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hate"
                            },
                            replace: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "like"
                            },
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "I hate this scratch extension"
                            }
                        }
                    },
                    {
                        opcode: "trimStr",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "trim [str]",
                        arguments: {
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world       ",
                            }
                        }
                    },
                    {
                        opcode: "regexReplace",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "replace [str] with [replacement] using [regex]",
                        arguments: {
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            replacement: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "$1"
                            },
                            regex: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello(.*)"
                            }
                        }
                    },
                    {
                        opcode: "advRound",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "round [num] to [dec] decimal places",
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.NUMBER, 
                                defaultValue: 1.99999999999999
                            },
                            dec: {
                                type: Scratch.ArgumentType.NUMBER, 
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: "encryptSHA256",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SHA256 encrypt [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptMD5",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "MD5 encrypt [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptSHA512",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SHA512 encrypt [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptSHA1",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SHA1 encrypt [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptSHA3",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "SHA3 encrypt [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptRIPEMD160",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "RIPEMD-160 encrypt [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptHmacMD5",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "HmacMD5 encrypt [txt] with password [pass]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            pass: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptHmacSHA1",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "HmacSHA1 encrypt [txt] with password [pass]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            pass: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptHmacSHA256",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "HmacSHA256 encrypt [txt] with password [pass]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            pass: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptHmacSHA512",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "HmacSHA512 encrypt [txt] with password [pass]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            pass: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "encryptAES",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "AES encrypt [txt] with key [key]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "decryptAES",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "AES decrypt [txt] with key [key]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "U2FsdGVkX18Bf79ZvMGrf/EgqyLMg+2uxSlya0zyT1U="
                            },
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "pow",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[x] to the power of [y]",
                        arguments: {
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },
                    {
                        opcode: "count",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "count [substr] in [str]",
                        arguments: {
                            substr: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "o"
                            },
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "factorial",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "factorial of [num]",
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    },
                    {
                        opcode: "base64Encode",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "encode [txt] to base64",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "base64Decode",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "decode [txt] from base64",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "aGVsbG8gd29ybGQ="
                            }
                        }
                    },
                    {
                        opcode: "binaryEncode",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "encode [txt] to binary",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "binaryDecode",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "decode [txt] from binary",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "0110100001100101011011000110110001101111001000000111011101101111011100100110110001100100"
                            }
                        }
                    },
                    {
                        opcode: "hexFromColor",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "hex of [col]",
                        arguments: {
                            col: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: "#ff0000"
                            }
                        }
                    },
                    {
                        opcode: "rgbFromColor",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "rgb of [col]",
                        arguments: {
                            col: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: "#ff0000"
                            }
                        }
                    },
                    {
                        opcode: "redOfRGB",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "red of [rgb]",
                        arguments: {
                            rgb: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "R255G0B0"
                            }
                        }
                    },
                    {
                        opcode: "greenOfRGB",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "green of [rgb]",
                        arguments: {
                            rgb: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "R0G255B0"
                            }
                        }
                    },
                    {
                        opcode: "blueOfRGB",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "blue of [rgb]",
                        arguments: {
                            rgb: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "R0G0B255"
                            }
                        }
                    },
                    {
                        opcode: "countVowels",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "count vowels in text [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "reverseText",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "reverse [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "getCache",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get [key] from cache",
                        arguments: {
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello"
                            }
                        }
                    },
                    {
                        opcode: "repeat",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "repeat [txt] [num] times",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello"
                            },
                            num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: "countWords",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "count words in [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "readFile",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "read file"
                    },
                    {
                        opcode: "textReporter",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING
                            }
                        }
                    },
                    {
                        opcode: "clipboard",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "clipboard"
                    },
                    {
                        opcode: "ip",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "ip"
                    },
                    {
                        opcode: "os",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "operating system"
                    },
                    {
                        opcode: "language",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "browser language"
                    },
                    {
                        opcode: "randomColor",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "random hex color",
                    },
                    {
                        opcode: "genUUIDv4",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "random UUID v4",
                    },
                    {
                        opcode: "genUUIDv6",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "random UUID v6",
                    },


                    "---",

                    {
                        opcode: "addCache",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set [key] to [val]",
                        arguments: {
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "tw:username"
                            },
                            val: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "sus"
                            }
                        }
                    },
                    {
                        opcode: "removeCache",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "remove [key] from cache",
                        arguments: {
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello"
                            }
                        }
                    },
                    {
                        opcode: "tts",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "speak [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "copy",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "copy [txt] to clipboard",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "log",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "console.log [txt]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "runJS",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "run [js]",
                        arguments: {
                            js: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "alert('hello world')"
                            }
                        }
                    },
                    {
                        opcode: "writeFile",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "write [txt] to file [file]",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            file: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello.txt"
                            }
                        }
                    },
                    {
                        opcode: "comment",
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: "// [text]",
                        arguments: {
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    },


                    "---",
                    
                    {
                        opcode: "empty",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[txt] is empty?",
                        arguments: {
                            txt: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: " "
                            }
                        }
                    },
                    {
                        opcode: "getTrue",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "true"
                    },
                    {
                        opcode: "getFalse",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "false"
                    },

                    {
                        opcode: "startsWith",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[str] starts with [str1]?",
                        arguments: {
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "apple"
                            },
                            str1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "app"
                            }
                        }
                    },
                    {
                        opcode: "endsWith",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[str] ends with [str1]?",
                        arguments: {
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "apple"
                            },
                            str1: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "le"
                            }
                        }
                    },
                    {
                        opcode: "matches",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[str] matches [regex]?",
                        arguments: {
                            str: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            },
                            regex: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello.*"
                            }
                        }
                    },
                    {
                        opcode: "isBetween",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[num] between [min] and [max]?",
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                            min: { 
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            max: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 20
                            }
                        }
                    },
                    {
                        opcode: "isPrime",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[num] is prime?",
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    },
                    {
                        opcode: "isWhole",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[num] is whole?",
                        arguments: {
                            num: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 100
                            }
                        }
                    }
                ],
                menus: {
                    MODEL_MENU: {
                        acceptReporters: false,
                        items: [{text: "gpt 3.5 turbo", "value": "gpt-3.5-turbo"}, {"text": "gpt 4", "value": "gpt-4"}]
                    },
                    METHOD_MENU: {
                        acceptReporters: false,
                        items: ["GET", "POST"]
                    },
                    FMT_MENU: {
                        acceptReporters: false,
                        items: ["JSON", "XML"]
                    },
                    CASE_MENU: {
                        acceptReporters: false,
                        items: ["UPPER CASE", "lower case", "Title Case"]
                    }
                },
            };
        }

        async aiPrompt({ string, model, temperature, apiKey }) {
            let url = 'https://api.openai.com/v1/chat/completions'
            let options = {
                method: "POST",
                body: JSON.stringify({
                    "model": model,
                    "messages": [{"role": "user", "content": string}],
                    "temperature": new Number(temperature),
                }),
                headers: {
                    "Authorization": "Bearer " + apiKey,
                    "Content-Type": "application/json"
                }
            }
            let response = await fetch(url, options);
            const json = await response.json();

            console.log(temperature);
            console.dir(json);

            return json.choices[0].message.content;
        }

        log({ txt }) {
            console.log(txt)
        }

        objectOf({field, obj}) {
            let parsed_obj = JSON.parse(obj);

            return parsed_obj[field];
        }

        convert({cfg, fmt}) {
            if (cfg == '') return '';
            let result = '';
            const pairs = cfg.split('&');
            const converted = {};

            pairs.forEach(pair => {
                const [key, val] = pair.split('=');
                converted[key] = val;
            });

            switch (fmt) {
                case "JSON": {
                    result = JSON.stringify(converted);
                    break;
                }
                case "XML": {
                    result += "<root>";
                    Object.keys(converted).forEach(key => {
                        result += `<${key}>${converted[key]}</${key}>`
                    });
                    result += "</root>";
                    break;
                }
                default: {
                    result = '';
                    console.error("This error is IMPOSSIBLE to get. If you get this error, you are officially the best hacker");
                    break;
                }
            };
            return result;
        }
        async request({method, url, bodyParams, headerParams}) {
            // TODO: properly implement headerParams. For now, it'll just fly out of the view.
            // bodyParams, headerParams are either JSON or XML. Otherwise, we'll return ''. :evilface:
            let request;
            if (method == "GET") {
                url += "?";
                url += bodyParams;
                request = {
                    method: method,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            } else {
                request = {
                    method: method,
                    body: JSON.parse(this.convert({cfg: bodyParams, fmt: "JSON"})),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            }
            let res = await fetch(url, request);
            const json = await res.json();

            return JSON.stringify(json);
        }

        copy({ txt }) {
            const document = window.document;
            // Create a txtarea element to temporarily hold the text
            const txtarea = document.createElement('textarea');
            txtarea.value = txt;

            // Make the txtarea invisible and append it to the document
            txtarea.style.position = 'fixed';
            document.body.appendChild(txtarea);

            // Select the txt within the textarea
            txtarea.select();
            txtarea.setSelectionRange(0, txtarea.value.length);

            // Execute the copy command to copy the selected txt
            document.execCommand('copy');

            // Clean up: remove the txtarea from the document
            document.body.removeChild(txtarea);
        }
        runJS({ js }) {
            eval(js);
        }
        toCase({ strCase, str }) {
            if (strCase == "UPPER CASE") {
                return str.toUpperCase();
            } else if (strCase == "lower case") {
                return str.toLowerCase();
            } else if (strCase == "Title Case") {
                return str.toLowerCase().replace(/\b\w/g, function (char) {
                    return char.toUpperCase();
                });
            } else {
                return '';
            }
        }
        replace({ find, replace, str }) {
            return str.replace(find, replace);
        }
        trimStr({ str }) {
            return str.trim();
        }
        startsWith({ str, str1 }) {
            return str.startsWith(str1);
        }
        endsWith({ str, str1 }) {
            return str.endsWith(str1);
        }
        matches({ str, regex }) {
            return !!str.match(new RegExp(regex));    
        }
        isBetween({ num, min, max }) {
            return num > min && num < max;
        }
        isPrime({ num }) {
            if (num <= 1) return false; // negatives
            if (num % 2 == 0 && num > 2) return false; // even numbers
            const s = Math.sqrt(num); // store the square to loop faster
            for(let i = 3; i <= s; i += 2) { // start from 3, stop at the square, increment in twos
                if(num % i === 0) return false; // modulo shows a divisor was found
            }
            return true;
        }
        regexReplace({ str, replacement, regex }) {
            try {
                const regexObj = new RegExp(regex, 'g');
                const result = str.replace(regexObj, replacement);
                return result;
            } catch (error) {
                console.error('Error in replaceWithRegex:', error.message);
                return str; // Return the original text in case of an error
            }
        }
        genUUIDv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        genUUIDv6() {
            return 'xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x6);
                return v.toString(16);
            });
        }
        randomColor() {
            return "#" + Math.floor(Math.random()*16777215).toString(16);
        }
        advRound({ num, dec }) {
            return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
        }
        pow({ x, y }) {
            return Math.pow(x, y);
        }
        count({ substr, str }) {
            return (str.match(new RegExp(substr, 'g')) || []).length;
        }
        isWhole({ num }) {
            return Math.round(num) == num;
        }
        factorial({ num }) {
            if (num === 0 || num === 1)
                return 1;
            for (var i = num - 1; i >= 1; i--) {
                num *= i;
            }
            return num;
        }
        language() {
            return navigator.language;
        }
        os() {
            return navigator.userAgentData.platform;
        }
        base64Encode({ txt }) {
            return btoa(txt);
        }
        base64Decode({ txt }) {
            return atob(txt);
        }
        binaryEncode({ txt }) {
            let binary = '';
            for (let i = 0; i < txt.length; i++) {
                let charCode = txt.charCodeAt(i).toString(2);
                binary += '0'.repeat(8 - charCode.length) + charCode;
            }
            return binary;
        }
        binaryDecode({ txt }) {
            txt = txt.match(/.{1,8}/g);
            const textResult = txt.map(binary => String.fromCharCode(parseInt(binary, 2)));
            return textResult.join('');
        }
        async ip() {
            if (ipCache === undefined) {
                try {
                    const response = await fetch('https://api.ipify.org?format=json');
                    const data = await response.json();
                    ipCache = data.ip;
                } catch (error) {
                    // this CANNOT fail unless you dont have internet or something.
                    return '';
                }
            }
            return ipCache;
        }
        textReporter({ txt }) { return txt; } 
        getTrue() { return true; }
        getFalse() { return false; }
        async clipboard() { return await navigator.clipboard.readText(); }
        hexFromColor({ col }) {
            return col;
        }
        rgbFromColor({ col }) {
            col = col.replace(/^#/, '');

            // Parse the hex value into RGB components
            const bigint = parseInt(col, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;

            return `R${r}G${g}B${b}`;
        }
        redOfRGB({ rgb }) {
            const match = rgb.match(/R(\d+)G(\d+)B(\d+)/);
            return match ? parseInt(match[1], 10) : "";
        }
        greenOfRGB({ rgb }) {
            const match = rgb.match(/R(\d+)G(\d+)B(\d+)/);
            return match ? parseInt(match[2], 10) : "";
        }
        blueOfRGB({ rgb }) {
            const match = rgb.match(/R(\d+)G(\d+)B(\d+)/);
            return match ? parseInt(match[3], 10) : "";
        }
        countVowels({ txt }) {
            const vowels = ['a', 'e', 'i', 'o', 'u'];

            let retVal = 0;
            for (let i = 0; i < txt.length; i++) {
                const currentChar = txt[i].toLowerCase();

                if (vowels.includes(currentChar) || (currentChar === 'y' && i > 0 && !vowels.includes(txt[i - 1].toLowerCase()))) {
                    retVal++;
                }
            }

            return retVal;
        }
        reverseText({ txt }) {
            var splitString = txt.split("");

            var reverseArray = splitString.reverse();

            var joinArray = reverseArray.join("");

            return joinArray;
        }
        countWords({ txt }) {
            return txt.split(' ').length
        }
        empty({ txt }) {
            return !txt.trim() || txt === "".trim();
        }
        async readFile() {
            return await new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt'; // optional: specify accepted file types

                input.onchange = function(event) {
                    const file = event.target.files[0];
                    const reader = new FileReader();

                    reader.onload = function(event) {
                        const contents = event.target.result;
                        resolve(contents);
                    };

                    reader.onerror = function(event) {
                        reject(new Error("File could not be read! Code " + event.target.error.code));
                    };

                    reader.readAsText(file);
                };

                input.click();
            }) 
        }
        writeFile({ txt, file }) {
            // Create a Blob from the provided text
            const blob = new Blob([txt], { type: 'text/plain' });

            // Create a link element
            const link = document.createElement('a');

            // Set the download attribute and create a URL for the blob
            link.download = file;
            link.href = window.URL.createObjectURL(blob);

            // Append the link to the document
            document.body.appendChild(link);

            // Programmatically click the link to trigger the download
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
        }
        comment({ text }) {return true} // lmao
        addCache({ key, val }) {
            localStorage.setItem(key, val)
        }
        removeCache({ key }) {
            localStorage.removeItem(key)
        }
        getCache({ key }) {
            return localStorage.getItem(key)
        }
        repeat({ txt, num }) {
            return txt.repeat(num)
        }
        encryptSHA256({ txt }) {
            return CryptoJS.SHA256(txt).toString()
        }
        encryptMD5({ txt }) {
            return CryptoJS.MD5(txt).toString()
        }
        encryptSHA512({ txt }) {
            return CryptoJS.SHA512(txt).toString()
        }
        encryptSHA1({ txt }) {
            return CryptoJS.SHA1(txt).toString()
        }
        encryptSHA3({ txt }) {
            return CryptoJS.SHA3(txt).toString()
        }
        encryptRIPEMD160({ txt }) {
            return CryptoJS.RIPEMD160(txt).toString()
        }
        encryptHmacMD5({ txt, pass }) {
            return CryptoJS.HmacMD5(txt, pass).toString()
        }
        encryptHmacSHA1({ txt, pass }) {
            return CryptoJS.HmacSHA1(txt, pass).toString()
        }
        encryptHmacSHA256({ txt, pass }) {
            return CryptoJS.HmacSHA256(txt, pass).toString()
        }
        encryptHmacSHA512({ txt, pass }) {
            return CryptoJS.HmacSHA512(txt, pass).toString()
        }
        decryptAES({ txt, key }) {
            return CryptoJS.AES.decrypt(txt, key).toString(CryptoJS.enc.Utf8)
        }
        encryptAES({ txt, key }) {
            return CryptoJS.AES.encrypt(txt, key).toString()
        }
        tts({ txt }) {
            const utterance = new SpeechSynthesisUtterance(txt);

            // Select a voice
            const voices = speechSynthesis.getVoices();
            utterance.voice = voices[0]; // Choose a specific voice

            // Speak the text
            speechSynthesis.speak(utterance);
        }
        async stt() {
            return await new Promise((resolve, reject) => {
                const recognition = new webkitSpeechRecognition() || SpeechRecognition()
                recognition.lang = 'en-US'
                recognition.interimResults = false
                recognition.maxAlternatives = 1

                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript
                    resolve(transcript)
                }

                recognition.onerror = function(event) {
                    reject(event.error)
                }

                recognition.start()
            });
        }
        encryptPBKDF2({ txt, pass }) {
            return CryptoJS.PBKDF2(pass, txt)
        }
    }

    Scratch.extensions.register(new UtilsExtension)
})(Scratch);
