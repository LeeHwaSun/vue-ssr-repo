<template>
  <div>
    <h1>Socket 테스트</h1>
    <div>
      <v-btn @click="joinRoom">방 입장</v-btn>
      <v-btn @click="leaveRoom">방 퇴장</v-btn>
      <v-btn @click="sendMsg">메시지 보내기</v-btn>
      <div>
        {{$store.state.config.test1}}
      </div>
    </div>
  </div>
  
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        title : "메인",
      }
    },
    title() {
      return this.title;
    },
    mounted() {
      this.$socket.on('room:msg', (data) => {
        console.log('room:msg', data);
      });
    },
    destroyed() {
      this.$socket.off('room:msg');
    },
    methods: {
      joinRoom() {
        this.$socket.emit('room:join', 'roomtest');
        console.log('join room')
      },
      leaveRoom() {
        this.$socket.emit('room:leave', 'roomtest');
        console.log('leave room')
      },
      sendMsg() {
        this.$socket.emit('room:send', {msg : 'Send Message'});
      }
    }
  }
</script>
