<template>
  <div class="text-center">
    <b-container class="p-4" fluid="true">
      <b-row>
        <b-col class="mb-5">
          <h2>Diari Jajan {{ new Date() | moment("MMMM YYYY") }}</h2>
          <p>Pengeluaran Bulan ini {{ totalItemsPerMonth | currency}}</p>
          <b-button variant="primary" @click="toggleModal">TAMBAH ITEM</b-button>
        </b-col>
      </b-row>
      <b-row v-if="loading">
        <b-col cols="12" md="3" class="mb-4" v-for="item in 4" :key="item">
          <b-skeleton-table
            :rows="5"
            :columns="1"
            :table-props="{ bordered: true, striped: true }"
          ></b-skeleton-table>
        </b-col>
      </b-row>
      <b-row v-else-if="!loading && !itemsFilterPerDay.length">
        <b-col cols="12" class="mb-4 not-found">
          <img src="../assets/images/not-found.png" alt="">
          <h1>Data tidak tersedia</h1>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col cols="12" md="3" class="mb-4" v-for="item in itemsFilterPerDay" :key="item.id">
          <b-card-group deck class="h-100">
            <b-card header-tag="header" class="text-left list-item">
              <template #header>
                <h6 class="mb-0">{{ item.month | moment('DD MMMM') }}</h6>
              </template>
              <b-table :items="item.group" :fields="fields" thead-class="d-none">
                <template #cell(created_at)="data">
                  {{ data.value | moment("HH:MM") }}
                </template>
                <template #cell(cost)="data">
                  <p class="text-right m-0">
                    {{ data.value | currency }}
                  </p>
                </template>
              </b-table>
              <b-row class="text-right m-0 footer-item">
                <b-col cols="7" class="mb-4">
                  Total
                </b-col>
                <b-col cols="5" class="mb-4">
                  {{ item.total | currency}}
                </b-col>
              </b-row>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
      <div class="text-center mt-5">
        <a href="https://www.linkedin.com/in/muhammad-kurnia/" target="_blank" rel="noopener noreferrer">Muhammad Kurnia</a>
      </div>
    </b-container>
    <b-modal ref="my-modal" hide-footer title="Tambah Entri">
      <b-row>
        <b-col cols="12" class="mb-4">
          <label for="name-input">Nama</label>
          <b-form-input type="text" id="name-input" v-model="name" placeholder="Masukan Nama"></b-form-input>
        </b-col>
        <b-col cols="12" class="mb-4">
          <label for="cost-input">Harga</label>
          <b-form-input type="number" id="cost-input" v-model="cost" placeholder="Masukan pengeluaran"></b-form-input>
        </b-col>
        <b-col cols="12" class="mb-4 text-right">
          <b-button class="mt-2 mr-2" @click="toggleModal" :disabled="loadingSubmit">
            <span v-if="loadingSubmit">
              <b-spinner small type="grow"></b-spinner>
              Loading...
            </span>
            <span v-else>Batal</span>
          </b-button>
          <b-button class="mt-2" variant="primary" @click="handleSubmit" :disabled="loadingSubmit">
            <span v-if="loadingSubmit">
              <b-spinner small type="grow"></b-spinner>
              Loading...
            </span>
            <span v-else>Kirim</span>
          </b-button>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import _ from 'lodash'

export default {
  data() {
    return {
      loading: true,
      loadingSubmit: false,
      fields: [
        {key: 'created_at'},
        {key: 'name'},
        {key: 'cost'}
      ],
      localItems: [],
      name: '',
      cost: null
    }
  },
  computed: {
    itemsFilterPerMonth() {
      const data = this.localItems.reduce((result, curr) => {
        const newDate = moment(new Date()).format("YYYY-MM")
        const itemDate = moment(curr.created_at).format("YYYY-MM")
        if (newDate === itemDate) {
          return [
            ...result,
            {
              ...curr,
              month: curr.created_at.substring(0, 10),
              convert_date: moment(curr.created_at).toDate()
            }
          ]
        }
        return result
      }, [])
      return data;
    },
    itemsFilterPerDay() {
      const grouping = _.chain(this.itemsFilterPerMonth)
        .groupBy('month')
        .map((value, key) => ({
          month: key,
          date: moment(key).toDate(),
          total: value.reduce((a,b) => a + b.cost, 0), // total per day
          group: value.sort((a, b) => a.convert_date - b.convert_date) }))
        .value()

      return grouping.sort((a, b) => b.date - a.date)
    },
    totalItemsPerMonth() {
      return this.itemsFilterPerMonth.reduce((result, current) => result + current.cost, 0)
    }
  },
  mounted() {
    this.getDataItem()
  },
  methods: {
    ...mapActions(['getItems', 'addItems']),
    async getDataItem() {
      this.loading = true;

      try {
        await this.getItems()
          .then((res) => {
            this.localItems = res
          })
      } catch (error) {
        this.$bvToast.toast(`Gagal menampilkan pengeluaran`, {
          toaster: 'b-toaster-top-center',
          variant: 'danger',
          title: 'Error',
          solid: true,
        })
        throw error
      } finally {
        this.loading = false
      }
    },
    toggleModal() {
      this.name = ''
      this.cost = null

      this.$refs['my-modal'].toggle('#toggle-btn')
    },
    async handleSubmit() {
      this.loadingSubmit = true;

      const payload = {
        name: this.name,
        cost: Number(this.cost),
        created_at: moment(new Date()).format("YYYY-MM-DD hh:mm:ss")
      }

      try {
        await this.addItems(payload).then(res => res)
        this.getDataItem()

        this.$bvToast.toast(`Pengeluaran berhasil ditambahkan`, {
          toaster: 'b-toaster-top-center',
          variant: 'success',
          title: 'Sukses',
          solid: true,
        })
      } catch (error) {
        this.$bvToast.toast(`Gagal menambahkan pengeluaran`, {
          toaster: 'b-toaster-top-center',
          variant: 'danger',
          title: 'Error',
          solid: true,
        })
        throw error
      } finally {
        this.loadingSubmit = false
        this.toggleModal()
      }
    }
  }
}
</script>
