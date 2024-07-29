<template>
  <v-container>
    <v-list>
      <v-list-item v-for="user in users" :key="user.id" @click="goToChat(user.id)">
        <v-list-item-content>
          <v-list-item-title>{{ user.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const users = ref([]);
    const router = useRouter();

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users/all', {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        users.value = data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const goToChat = (userId) => {
      router.push(`/chat/${userId}`);
    };

    onMounted(fetchUsers);

    return {
      users,
      goToChat
    };
  }
};
</script>
-----------------------------------














<template>
  <v-container>
    <v-list>
      <v-list-item v-for="user in users" :key="user.id" @click="goToChat(user.id)">
        <v-list-item-content>
          <v-list-item-title>{{ user.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const users = ref([]);
    const router = useRouter();

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/users/all', {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        users.value = data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const goToChat = (userId) => {
      router.push(`/chat/${userId}`);
    };

    onMounted(fetchUsers);

    return {
      users,
      goToChat
    };
  }
};
</script>
