<template>
  <div id="app">
     <beautiful-chat
      :typing="typing"
      :participants="participants"
      :title="title"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="true"
      :showEmoji="true"
      :showFile="false"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling" />
  </div>
</template>

<script>
  import messages from '../messageList.js'

  var Message = function(conf){
    return { 
      author: conf.author || "me", 
      type: 'text', 
      data: { 
        text: conf.data.text || ""
      } 
    }
  }
    
  //split long messages
  var messageList = [];
  messages.forEach(message => {
    var nodes = message.data.text.split(',');
    if( nodes.length > 2){
      nodes.forEach( n => messageList.push(new Message({ author: message.author, data: { text: n}} )));
    }else{
      messageList.push(new Message(message));
    }
  });

  var timeOuts = [];
  export default {
      name: 'app',
      mounted(){
        this.doTheLoop();
      },
      computed: {
        prevMsg() { 
          if(typeof messageList[this.$data.idx - 1] === "undefined") return null;
          return messageList[this.$data.idx - 1]; 
        },
        msg() { 
          return messageList[this.$data.idx]; 
        },
        nextMsg() { 
          if(typeof messageList[this.$data.idx + 1] === "undefined") return null;
          return messageList[this.$data.idx + 1];
         }
      },
      data() {
        return {
          idx: 0,
          typing: "",
          participants: [
            {
              id: 'me',
              name: 'Sophie',
              imageUrl: 'images/sophie.jpg'
            },
            {
              id: 'psychologue',
              name: 'PSYCHOLOGUE',
              imageUrl: 'images/psy.jpg'
            }/*,
            {
              id: 'VOIX',
              name: 'Narrateur',
              imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
            }*/
          ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
          title: "Sophie Pétoncule chez le psychologue",
          titleImageUrl: 'images/sophie.jpg',
          messageList: [],
          newMessagesCount: 0,
          isChatOpen: true, // to determine whether the chat window should be open or closed
          showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
          colors: {
            header: {
              bg: '#4e8cff',
              text: '#ffffff'
            },
            launcher: {
              bg: '#4e8cff'
            },
            messageList: {
              bg: '#ffffff'
            },
            sentMessage: {
              bg: '#4e8cff',
              text: '#ffffff'
            },
            receivedMessage: {
              bg: '#eaeaea',
              text: '#222222'
            },
            userInput: {
              bg: '#f4f7f9',
              text: '#565867'
            }
          }, // specifies the color scheme for the component
          alwaysScrollToBottom: true, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
          messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
        }
      },
      methods: {
        doTheLoop(){
          this.getMsg()
          //read msg
          .then(()=> this.readMsg())
          //type
          .then(()=> this.typeMsg())
          //send
          .then(()=> this.sendMsg())
          .then(()=> this.doTheLoop())
          .catch(e => console.log("fin"))
        },
        getMsg(){
          this.messageList = [...this.messageList, new Message(this.msg)];
          return new Promise((resolve, reject)=>{
            resolve();
          })
        },
        readMsg(){
          var txt = this.msg.data.text;
          if(this.nextMsg.author != "me") {
            this.$data.showTypingIndicator = this.nextMsg.author;
          }
          return new Promise((resolve, reject)=>{
            this.think(txt.length*120).then(() => {
              this.$data.showTypingIndicator = "";
              resolve();
            })
          })
        },
        typeMsg(){
          this.$data.idx++;
          if(typeof this.msg === "undefined") throw new Error("fin");
          this.$data.typing = "";
          
          if(this.msg.author == "me") {
            return this.keyboard();
          }
          this.$data.showTypingIndicator = this.msg.author;
          return new Promise((resolve, reject)=> resolve());
        },
        sendMsg(){
          this.$data.typing = "";
          this.$data.showTypingIndicator = "";
          return new Promise((resolve, reject)=>{
            resolve();
          })
        },
        
        onMessageWasSent(message) {
          // called when the user sends a message
          // this.messageList = [...this.messageList, message]
        },
        think(delay){         
          return new Promise(function(resolve, reject){
            var tmOut;
            tmOut = window.setTimeout(function () {
              resolve(tmOut);
            },delay);
          })
        },
        keyboard(){
          var str = this.msg.data.text;
          this.$data.showTypingIndicator = "";

          return new Promise((resolve, reject) => {
            var tick = (str, charIdx) => {
              if (charIdx < str.length) {
                this.$data.typing += str[charIdx];
                return this.think(120).then(() => tick(str, charIdx + 1));
              }
              resolve()
            }

            tick(str, 0);
          });          
        },
      }
    }
</script>

<!-- CSS libraries -->
<style src="normalize.css/normalize.css"></style>

<!-- Global CSS -->
<style>
  code {
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    font-size: 0.9em;
    white-space: pre-wrap;
    color: #2c3e50;
  }

  code::before, code::after {
    content: '`';
  }
</style>

<!-- Scoped component css -->
<!-- It only affect current component -->
<style scoped>
  #app {
    text-align: center;
  }

  #app h1 {
    color: #2c3e50;
    font-weight: 300;
    margin: 0;
  }

  .banner {
    height: 200px;
    background-color: #f6f6f6;
    padding: 50px 10px;
  }

  .bottom {
    padding: 80px 10px;
    font-size: 24px;
    font-weight: 300;
  }

  .fade {
    font-size: 14px;
  }

  .logo {
    animation: spin 4s 1s infinite linear
  }

  @keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
  }
  
</style>
