<template>
  <v-container>
    <v-list>
      <v-list-item v-for="message in messages" :key="message.id">
        <v-list-item-content>
          <v-list-item-title :class="{'my-message': message.sender_id == currentUser, 'other-message': message.sender_id != currentUser}">
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

<script setup>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
import { useRoute } from 'vue-router';
const route = useRoute();
const socket = io('http://localhost:3003', {
  transports: ['websocket', 'polling']
});

const messages = ref([]);
const newMessage = ref('');
const userId = route.params.userId;
const currentUser = localStorage.getItem('currentUser'); 

const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3003/message/${userId}`, {
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
    const messageData = { content: newMessage.value, sender_id: currentUser };
    await fetch('http://localhost:3003/message/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(messageData)
    });
    socket.emit("sendMessage", messageData); // Send message to server via socket
    newMessage.value = ''; // Clear the input field
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

onMounted(() => {
  socket.on('message', (message) => {
    console.log('Message received in Vue:', message);
    messages.value.push(message);
  });

  fetchMessages();
});
</script>

<style scoped>
/* Container styling */
.v-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* List styling */
.v-list {
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.v-list-item {
  margin-bottom: 10px;
}

.v-list-item-content {
  display: flex;
  flex-direction: column;
}

/* Message styling */
.my-message {
  background-color: #007bff;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 15px;
  margin-left: auto;
  max-width: 80%;
  word-wrap: break-word;
}

.other-message {
  background-color: #f1f1f1;
  color: #333333;
  border-radius: 12px;
  padding: 10px 15px;
  max-width: 80%;
  word-wrap: break-word;
}

/* Form styling */
v-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

v-text-field {
  flex: 1;
}

v-btn {
  background-color: #007bff;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: bold;
  border-radius: 5px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

v-btn:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}

v-btn:focus {
  outline: none;
}

v-btn:active {
  background-color: #004494;
}
</style>

<!-- <template>
  <v-container>
    <v-list>
      <v-list-item v-for="message in messages" :key="message.id">
        <v-list-item-content>
          <v-list-item-title :class="{'my-message': message.sender_id == currentUser, 'other-message': message.sender_id != currentUser}">
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

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import io from 'socket.io-client';

const socket = io('http://localhost:3003', {
  transports: ['websocket', 'polling']
});

const route = useRoute();
const messages = ref([]);
const newMessage = ref('');
const userId = route.params.userId;
const currentUser = localStorage.getItem('currentUser');
const room = `room_${currentUser}_${userId}`;

const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3003/message/${userId}`, {
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
    const messageData = { content: newMessage.value, receiverId: userId, room, sender_id: currentUser };
    await fetch(`http://localhost:3003/message/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(messageData)
    });
    console.log('Message sent:', messageData);
    socket.emit("sendMessage", messageData); // Send message to server via socket
    newMessage.value = ''; // Clear the input field
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

onMounted(() => {
  socket.emit('joinRoom', room);
  console.log('Joined room:', room);

  socket.on('message', (message) => {
  console.log('Message received in Vue:', message);
  messages.value = [...messages.value, message]; // Spread operator to ensure reactivity
});

  fetchMessages(); // Fetch initial messages
});

</script>

<style>
.my-message {
  text-align: right;
}
.other-message {
  text-align: left;
}
</style> -->