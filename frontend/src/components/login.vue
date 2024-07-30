<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
      <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
      <v-btn type="submit">Login</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const login = async () => {
      try {
        const response = await fetch('http://localhost:3003/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        console.log("data.id",data);
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('currentUser', data.id);
          router.push('/user');
        } else {
          console.log("error has occured here")
        }
      } catch (error) {
        console.error(error);
      }
    };


</script>

<style scoped>
.v-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

v-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

v-text-field {
  margin-bottom: 20px;
}

v-text-field input {
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 12px 15px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

v-text-field input:focus {
  border-color: #0056b3;
  outline: none;
}

v-text-field label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

v-btn {
  align-self: center;
  background-color: #007bff;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: bold;
  padding: 12px 20px;
  border-radius: 5px;
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
