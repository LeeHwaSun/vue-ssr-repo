<template>
  <div>
    <h1>토스트 테스트</h1>
    <div>
      <v-btn @click="toastTestInfo">토스트 Info</v-btn>
      <v-btn @click="toastTestSuccess">토스트 Success</v-btn>
      <v-btn @click="toastTestError">토스트 Error</v-btn>
      <v-btn @click="toastTestWarning">토스트 Warning</v-btn>
      <v-btn @click="toastTestGlobalError">전역에러</v-btn>
    </div>
    <h1>프로그레스 바 테스트</h1>
    <div>
      <v-btn @click="barStart">Start</v-btn>
      <v-btn @click="barFinish">Finish</v-btn>
      <v-btn @click="barFail">Fail</v-btn>
    </div>
    <h1>Notify 테스트</h1>
    <div>
      <v-btn @click="notifyAlert">Alert</v-btn>
      <v-btn @click="notifyConfirm">Confirm</v-btn>
      <v-btn @click="notifyPrompt">Prompt</v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      toastTestInfo() {
        this.$toast.info("Hello Info");
      },
      toastTestSuccess() {
        this.$toast.success("Hello Success");
      },
      toastTestError() {
        this.$toast.error("Hello Error");
      },
      toastTestWarning() {
        this.$toast.warning("Hello Warning");
      },
      toastTestGlobalError() {
        throw new Error("전역 에러");
      },
      barStart() {
        this.$Progress.start();
      },
      barFinish() {
        this.$Progress.finish();
      },
      barFail() {
        this.$Progress.fail();
      },
      async notifyAlert() {
        const res = await this.$myNotify.alert("테스트 내용입니다.", "안내", {
          icon: "mdi-video-4k-box",
        });
        console.log(res);
      },
      async notifyConfirm() {
        const res = await this.$myNotify.confirm("테스트 내용입니다.", "");
        console.log(res);
      },
      async notifyPrompt() {
        const res = await this.$myNotify.prompt(
          "테스트 내용입니다.", 
          "프롬프트",
          { width: 200 }
        );
        console.log(res);
      }
    }
  }
</script>
