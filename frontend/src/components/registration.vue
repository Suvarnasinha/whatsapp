<template>
  <v-container>
    <v-form @submit.prevent="register">
      <v-text-field v-model="username" label="Username" required></v-text-field>
      <v-text-field v-model="phoneNumber" label="Phone Number" required></v-text-field>
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn type="submit">Register</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const phoneNumber = ref('');
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const register = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.value,
            phoneNumber: phoneNumber.value,
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (data.token) {
          router.push('/login');
        } else {
          // Handle registration error
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      username,
      phoneNumber,
      email,
      password,
      register,
    };
  },
};
</script>
