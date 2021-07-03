import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.2/vue.esm-browser.min.js';

let editProductModal = null;
let delProductModal = null;
let toast = null;

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/',
      apiPath: 'carolyang-vue3',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      message: {
        text: '',
        bg: '',
      },
    };
  },
  methods: {
    getProducts() {
      axios.get(`${this.apiUrl}api/${this.apiPath}/admin/products/all`)
      .then((res) => {
        if (res.data.success) {
          this.products = res.data.products;
        } else {
          this.message = {
            text: `${res.data.message}`,
            bg: 'bg-danger',
          };
          toast.show();
          window.location = 'index.html';
        }
      })
      .catch(() => {
        this.message = {
          text: '取得產品列表失敗',
          bg: 'bg-danger',
        };
        toast.show();
      })
    },
    updateProduct() {
      let url = `${this.apiUrl}api/${this.apiPath}/admin/product`;
      let httpMethod = 'post';

      if (this.tempProduct.id) {
        url = `${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }

      axios[httpMethod](url, {data: this.tempProduct})
        .then((res) => {
          if(res.data.success) {
            this.message = {
              text: '更新成功',
              bg: 'bg-success',
            };
            toast.show();
            this.getProducts();
            editProductModal.hide();
          } else {
            this.message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            toast.show();
          }
        })
        .catch(() => {
          this.message = {
            text: '更新失敗',
            bg: 'bg-danger',
          };
          toast.show();
        })
    },
    toggleProductEnable(product) {
      if (product.is_enabled) {
        product.is_enabled = 0;
      } else {
        product.is_enabled = 1;
      }
      axios.put(`${this.apiUrl}api/${this.apiPath}/admin/product/${product.id}`, { data: product })
        .then((res) => {
          if (res.data.success) {
            this.message = {
              text: `${product.is_enabled == '1' ? '啟用產品成功' : '關閉產品成功'}`,
              bg: 'bg-success',
            };
            toast.show();
            this.getProducts();
            editProductModal.hide();
          } else {
            this.message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            toast.show();
          }
        })
        .catch(() => {
          this.message = {
            text: `${product.is_enabled ? '啟用產品失敗' : '關閉產品失敗'}`,
            bg: 'bg-danger',
          };
          toast.show();
        })
    },
    delProduct() {
      axios.delete(`${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
        .then((res) => {
          if (res.data.success) {
            this.message = {
              text: '刪除產品成功',
              bg: 'bg-success',
            };
            toast.show();
            this.getProducts();
            delProductModal.hide();
          } else {
            this.message = {
              text: `${res.data.message}`,
              bg: 'bg-danger',
            };
            toast.show();
          }
        })
        .catch(() => {
          this.message = {
            text: '刪除產品失敗',
            bg: 'bg-danger',
          };
          toast.show();
        })
    },
    openModal(type, product) {
      switch (type) {
        case 'new':
          this.tempProduct = {
            imagesUrl: [],
          }
          editProductModal.show();
          break;
        case 'edit':
          this.tempProduct = JSON.parse(JSON.stringify(product));
          editProductModal.show();
          break;
        case 'del':
          this.tempProduct = {...product };
          delProductModal.show();
      }
    },
    checkLogin() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolVueToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      if (token === '') {
        this.message = {
          text: '您尚未登入',
          bg: 'bg-danger',
        };
        toast.show();
        window.location = 'index.html';
      }
      axios.defaults.headers.common.Authorization = token;
      this.getProducts();
    },
  },
  mounted() {
    this.checkLogin();

    editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    toast = new bootstrap.Toast(document.getElementById('tostMessage'));
  },
}).mount('#app');
