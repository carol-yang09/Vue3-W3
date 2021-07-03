import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.2/vue.esm-browser.min.js';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/',
      apiPath: 'carolyang-vue3',
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      axios.post(`${this.apiUrl}admin/signin`, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;
            document.cookie = `hexschoolVueToken=${token};expires=${new Date(expired)}; path=/`;
            window.location = 'products.html';
          } else {
            alert(res.data.message);
          }
        })
        .catch(() => {
          alert('登入錯誤');
        })
    },
  },
}).mount('#app');
