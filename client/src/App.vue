<template>
  <div id="app">
    <h1 class="subtitle has-text-centered">Bucket List:</h1>
    <hr />
    <div class="field has-addons">
      <div class="control is-expanded">
        <input
          class="input"
          v-model="description"
          type="text"
          placeholder="Go to mars ..."
        />
      </div>
      <div class="control">
        <a
          class="button is-info"
          @click="addItem"
          v-bind:disabled="!description"
          >Add</a
        >
      </div>
    </div>
    <div class="notification" v-for="(item, idx) in items" :key="item._id">
      <div class="columns">
        <input
          class="column input"
          v-if="isSelected(item)"
          v-model="editedDescription"
        />
        <p v-else class="column">
          <span class="tag is-primary">{{ idx + 1 }}</span>
          {{ item.description }}
        </p>
        <div class="column is-narrow">
          <span
            class="incon has-text-primary"
            v-on:click="isSelected(item) ? unselect() : select(item)"
          >
            <i class="material-icons">{{
              isSelected(item) ? "close" : "edit"
            }}</i>
          </span>
          <span
            class="icon has-text-info"
            @click="
              isSelected(item) ? updateItem(item, idx) : removeItem(item, idx)
            "
          >
            <i class="material-icons">{{
              isSelected(item) ? "save" : "delete"
            }}</i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data: () => ({
    items: [],
    description: "",
    editedDescription: "",
    selected: {},
  }),
  async mounted() {
    const response = await axios.get("api/bucketListItems/");
    this.items = response.data;
  },
  methods: {
    async addItem() {
      const response = await axios.post("api/bucketListItems/", {
        description: this.description,
      });
      this.items.push(response.data);
      this.description = "";
    },

    async removeItem(item, idx) {
      await axios.delete(`api/bucketListItems/${item._id}`);
      this.items.splice(idx, 1);
    },

    select(item) {
      this.selected = item;
      this.editedDescription = item.description;
    },

    isSelected(item) {
      return item._id === this.selected._id;
    },

    unselect() {
      this.selected = {};
      this.editedDescription = "";
    },

    async updateItem(item, idx) {
      const response = await axios.put(`api/bucketListItems/${item._id}`, {
        description: this.editedDescription,
      });
      this.items[idx] = response.data;
      this.unselect();
    },
  },
};
</script>

<style>
#app {
  margin: auto;
  margin-top: 3rem;
  max-width: 700px;
}

.icon {
  cursor: pointer;
}
</style>
