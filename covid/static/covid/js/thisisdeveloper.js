var app = new Vue({
    el: '#app-interface',
    delimiters: ['<%', '%>'],
    beforeMount(){
        let self = this;
        //Connect to socket and initialize socket destroy
        self.initiateSocket();
        let p = localStorage.getItem("p");
        if(p){
            let lang = CryptoJS.RabbitLegacy.decrypt(p, self.key);
            lang = lang.toString(CryptoJS.enc.Utf8);
            self.botMsgPost(lang);
            self.regRecog(lang);
            self.lang = lang;
        }else{
            self.botMsgPre();
        }
    },
    data: {
        key: "HobjShtfaLthqyFF35w1UwKhfz6IceeY6XpmF6a0fovNYmPBXE+QpWiFiGNOVwfoaWWmsknSGlPHywctskkKXQ==",
        input: "",
        socket: "",
        ioDestroy: "",
        recognition: "",
        // languages: {
        //     "Hindi": "hi-IN",
        //     "English": "en-IN",
        //     "Bengali": "bn-IN",
        //     "Gujarati": "gu-IN",
        //     "Kannada": "kn-IN",
        //     "Malayalam": "ml-IN",
        //     "Marathi": "mr-IN",
        //     "Punjabi": "pa-guru-IN",
        //     "Tamil": "ta-IN",
        //     "Telugu": "te-IN",
        //     "Urdu": "ur-IN"
        // },
        languages: {
            "मराठी": "mr-IN",
            "हिंदी": "hi-IN",
            "English": "en-IN",
            "বাংলা": "bn-IN",
            "ગુજરાતી": "gu-IN",
            "ಕನ್ನಡ": "kn-IN",
            "മലയാളം": "ml-IN",
            "ਪੰਜਾਬੀ": "pa-guru-IN",
            "தமிழ்": "ta-IN",
            "తెలుగు": "te-IN",
            "اردو": "ur-IN"
        },
        lang: "English",
        messages: [],
        firstMsg: true,
        voiceActive: false,
    },
    methods: {
        botMsgPre(){
            let self = this;
            self.messages = [];
            let botmsg = {
                type: "bot",
                message: "In which language would you like to speak?",
                button: {
                    callback: "regRecog",
                    btns: []
                }
            }
            Object.keys(self.languages).forEach(lang=>{
                botmsg.button.btns.push({
                    text: lang,
                    value: self.languages[lang]
                })
            })
            self.messages.push(botmsg);
        },
        botMsgPost(lang){
            let self = this;
            self.messages = [];
            // switch case to display inital message in native language
            self.messages.push({
                type: "bot",
                message: "Hi, You can ask question regarding COVID 19",
                button: {
                    callback: "resetVoice",
                    btns: [{
                        text: "Reset voice from "+lang,
                        value: "reset"
                    }]
                }
            });
        },
        regRecogBtn(callback, value){
            let self = this;
            this[callback](value);
            if(callback=="regRecog"){
                self.lang = value;
                self.botMsgPost(value);
            }
        },
        resetVoice(lang){
            let self = this;
            localStorage.removeItem("p");
            self.recognition = "";
            self.botMsgPre();
        },
        regRecog(lang){
            let self = this;
            let enc = CryptoJS.RabbitLegacy.encrypt(lang, self.key).toString();
            localStorage.setItem("p", enc);
            if(navigator.userAgent.indexOf('Chrome') !== -1){
                try {
                    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    self.recognition = new SpeechRecognition();
                    self.recognition.lang = self.languages[lang];
                    self.recognition.interimResults = true;
                }catch(e) {
                    console.log(e);
                }
                self.recognition.onresult = event => {
                    let current = event.resultIndex;
                    let transcript = event.results[current][0].transcript;
                    self.input = transcript;
                };
                self.recognition.onend = event => {
                    self.voiceActive = false;
                    self.sendMessage();
                };
                self.recognition.onstart = event => {
                    self.voiceActive = true;
                };
                self.recognition.onerror = event => {
                    if(event.error == 'not-allowed') {
                        alert("Permission required to access Microphone")  
                    }else{
                        console.log("Error while recognition.")
                    }
                };
            };
        },
        recogVoice(){
            let self = this;
            if(!self.voiceActive)self.recognition.start();
        },
        destroySocket(){
            let self = this;
            if(self.socket!=""){
            if (self.ioDestroy==""){
                self.ioDestroy = setTimeout(function(){
                    self.socket.close();
                    self.socket = "";
                }, 600000);
            }else{
                clearTimeout(self.ioDestroy);
            }}
        },
        sendMessage(){
            let self = this;
            if(self.input!=""){
                if(!self.socketConn){
                    self.initiateSocket();
                }
                self.socket.emit("message", {message: self.input});
                self.destroySocket();
                if(self.firstMsg){
                    self.firstMsg = false;
                    self.messages[0].button = undefined;
                }
                self.messages.push({
                    type: "user",
                    message: self.input
                });
                $(".conv-element").animate({ scrollTop: $('.conv-element').prop("scrollHeight")}, 300);
                self.input = "";
            }
        },
        initiateSocket(){
            self = this;
            self.socket = io.connect("https://chat.equishell.com/");
            self.socket.on("answers", data=>{
                data = JSON.parse(atob(data));
                self.messages.push({
                    type: "bot",
                    message: data.answer
                });
                $(".conv-element").animate({ scrollTop: $('.conv-element').prop("scrollHeight")}, 300);
            });
            self.destroySocket();
        },
    }
});
window.onbeforeunload = () => {
    return false;
}