<template>
    <div>
        <form class="w-100 mx-auto form-container mt-5 p-5 border">
            <div class="mb-3">
                <label for="usernameInput" class="form-label">Username</label>
                <input type="text" class="form-control" id="usernameInput" aria-describedby="UsernameHelp">
            </div>
            <div class="mb-3">
                <label for="emailInput" class="form-label">Email address</label>
                <input type="email" class="form-control" id="emailInput" aria-describedby="EmailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="passwordInput" class="form-label">Password</label>
                <input type="password" class="form-control" id="passwordInput">
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary">Create account</button>
            </div>
        </form>
    </div>
</template>

<style>
    .form-container {
        max-width: 60%;
    }
</style>