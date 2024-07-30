<template>
  <v-container>
    <v-list>
      <v-list-item v-for="user in users" :key="user.id" @click="goToChat(user.id)">
        <v-list-item-content>
          <v-list-item-title>{{ user.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ user.phoneNumber }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const currentUser=localStorage.getItem('currentUser')
    console.log("currentUser",currentUser)
export default {
  setup() {
    const users = ref([]);
    const router = useRouter();

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3003/user', {
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
<style scoped>
/* Container styling */
.v-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: linear-gradient(to bottom, #ffffff, #f7f7f7);
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

/* List styling */
v-list {
  padding: 0;
  margin: 0;
}

v-list-item {
  cursor: pointer;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

v-list-item:hover {
  background: #e9ecef;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-4px);
}

v-list-item-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

v-list-item-title {
  font-size: 18px;
  font-weight: 700;
  color: #333333;
  transition: color 0.3s ease;
}

v-list-item-subtitle {
  font-size: 15px;
  color: #6c757d;
}

v-list-item-title:hover {
  color: #007bff;
}

v-list-item-subtitle:hover {
  color: #495057;
}
</style>
