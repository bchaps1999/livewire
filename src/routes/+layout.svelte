<script lang="ts">
  import AuthStatus from '$lib/components/AuthStatus.svelte';
  import '../app.css'; // Example: if you have a global stylesheet
</script>

<div class="app-container">
  <header class="app-header">
    <div class="logo">
      <a href="/">MyMottoApp</a>
    </div>
    <nav class="app-nav">
      <!-- Add other navigation links here if you have them -->
      <!-- e.g., <a href="/about">About</a> -->
    </nav>
    <div class="auth-widget-area">
      <AuthStatus />
    </div>
  </header>

  <main class="main-content">
    <slot />
  </main>

  <footer class="app-footer">
    <p>&copy; {new Date().getFullYear()} MyMottoApp. All rights reserved.</p>
  </footer>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: sans-serif;
  }

  .app-header {
    background-color: #f0f0f0;
    padding: 1rem 2rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .logo a {
    font-weight: bold;
    font-size: 1.5rem;
    text-decoration: none;
    color: #333;
  }

  .app-nav {
    margin-left: 2rem;
  }

  .app-nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: #555;
  }

  .app-nav a:hover {
    color: #000;
  }

  .auth-widget-area {
    margin-left: auto; /* Pushes the auth widget to the right */
  }

  .main-content {
    flex-grow: 1;
    padding: 2rem;
  }

  .app-footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
  }
</style> 