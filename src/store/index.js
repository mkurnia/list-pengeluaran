import * as axios from 'axios'
export default {
  actions: {
    async getItems() {
      const config = {
        url: `${process.env.VUE_APP_BASE_API}/items`,
        method: 'GET'
      };

      try {
        const { data } = await axios(config);

        return data
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async addItems(context , data) {
      const config = {
        url: `${process.env.VUE_APP_BASE_API}/items`,
        method: 'POST',
        data
      };

      try {
        const { data } = await axios(config);

        return data
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
}