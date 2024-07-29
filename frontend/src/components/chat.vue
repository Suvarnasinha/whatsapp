<template>
  <v-container>
    <v-list>
      <v-list-item v-for="message in messages" :key="message.id">
        <v-list-item-content>
          <v-list-item-title :class="{'my-message': message.sender_id === currentUser.id, 'other-message': message.sender_id !== currentUser.id}">
            {{ message.content }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-form @submit.prevent="sendMessage">
      <v-text-field v-model="newMessage" label="Type a message" required></v-text-field>
      <v-btn type="submit">Send</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const messages = ref([]);
    const newMessage = ref('');
    const currentUser = ref(JSON.parse(localStorage.getItem('currentUser'))); // Assuming you store the logged-in user info in localStorage

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/chat/${route.params.userId}`, {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        messages.value = data;
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const sendMessage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/chat/${route.params.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ content: newMessage.value })
        });
        const data = await response.json();
        messages.value.push(data);
        newMessage.value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    onMounted(fetchMessages);

    return {
      messages,
      newMessage,
      sendMessage,
      currentUser
    };
  }
};
</script>

<style>
.my-message {
  text-align: right;
}
.other-message {
  text-align: left;
}
</style>
------------------------
















<template>
  <v-container>
    <v-list>
      <v-list-item v-for="message in messages" :key="message.id">
        <v-list-item-content>
          <v-list-item-title :class="{ 'my-message': message.sender_id === currentUserId }">{{ message.content }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-text-field v-model="newMessage" label="Type a message..." @keyup.enter="sendMessage"></v-text-field>
    <v-btn @click="sendMessage">Send</v-btn>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const messages = ref([]);
    const newMessage = ref('');
    const currentUserId = ref(null); // Set this to the logged-in user's ID
    const receiverId = ref(route.params.id); // Get the receiver's ID from the route params

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/messages/${receiverId.value}`, {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        messages.value = data;
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const sendMessage = async () => {
      if (!newMessage.value.trim()) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            receiverId: receiverId.value,
            content: newMessage.value
          })
        });

        const data = await response.json();
        messages.value.push(data.message);
        newMessage.value = '';
      } catch (error) {
        console.error('Error sending message:', error);
      }
    };

    onMounted(() => {
      // Assume you have a method to get the current user ID
      currentUserId.value = 1; // Replace this with the actual current user ID
      fetchMessages();
    });

    return {
      messages,
      newMessage,
      sendMessage,
      currentUserId,
      receiverId
    };
  }
};
</script>

<style>
.my-message {
  text-align: right;
}
</style>
