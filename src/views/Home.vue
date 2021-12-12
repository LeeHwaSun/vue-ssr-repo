<template>
  <div>
    <h1>Socket 테스트</h1>
    <div>
      <v-btn @click="joinRoom('testroom')">방 입장</v-btn>
      <v-btn @click="leaveRoom('testroom')">방 퇴장</v-btn>
      <v-btn @click="sendMsg(1)">전체</v-btn>
      <v-btn @click="sendMsg(2)">브로드캐스트</v-btn>
      <v-btn @click="sendMsg(3)">룸</v-btn>
      <v-btn @click="sendMsg(4)">룸 브로드캐스트</v-btn>
      <div>{{$store.state.config.test_tt}}</div>
    </div>
    <div>
      <v-text-field v-model="toId" label="회원ID"></v-text-field>
      <v-text-field v-model="userMsg" label="메시지"></v-text-field>
      <v-btn @click="sendUser">사용자에게 메시지 보내기</v-btn>
    </div>
  </div>
  
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    name: "Home",
    data() {
      return {
        title : "메인",
        toId : "",
        userMsg : "",
      }
    },
    title() {
      return this.title;
    },
    socket() {
      return {
        'room:msg' : (data) => {
          console.log('room:msg', data);
        },
        'room:chat' : (data) => {
          console.log('room:chat', data);
          this.toId = data.fromId;
          this.userMsg = data.userMsg;
        }
      }
    },
    methods: {
      ...mapActions('socket', ["joinRoom", "leaveRoom"]),
      sendMsg(target) {
        this.$socket.emit('room:send', {msg : target + ' Send Message', target : target});
      },
      sendUser() {
        const { toId, userMsg } = this;
        const { user } = this.$store.state.user;
        console.log( toId, userMsg, user);
        if (toId && userMsg && user) {
          this.$socket.emit('room:chat', { 
            toId, 
            userMsg,
            fromId : user.user_id
          });
        }
      }
    }
  }
</script>
