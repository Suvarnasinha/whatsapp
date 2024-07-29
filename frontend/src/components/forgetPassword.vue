<template>
  <v-container>
    <v-form @submit.prevent="forgotPassword">
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-btn type="submit">Reset Password</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const email = ref('');

    const forgotPassword = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.value }),
        });
        const data = await response.json();
        if (data.message) {
          // Handle successful password reset request
        } else {
          // Handle error
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      email,
      forgotPassword,
    };
  },
};
</script>
