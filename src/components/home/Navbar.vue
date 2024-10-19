<script setup lang="ts" name="Navbar">

</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
        <div class="container-fluid">
            <RouterLink to="/home" class="navbar-brand">
                <img src="@/assets/logo.png" alt="logo" style="width: 160px;">
            </RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end me-3" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <RouterLink to="/home" class="nav-link" aria-current="page"><i class="bi bi-house me-1"></i>首頁
                        </RouterLink>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-bookmarks"></i>
                            我的課表
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdownMenuLink">
                            <li>
                                <RouterLink to="/workoutList" class="dropdown-item"><i
                                        class="bi bi-archive me-2"></i>課表總覽
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/createWorkout" class="dropdown-item"><i
                                        class="bi bi-bookmark-plus me-2"></i>創建課表
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-joystick"></i>
                            健身挑戰
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdownMenuLink">
                            <li>
                                <RouterLink to="/challengeList" class="dropdown-item"><i
                                        class="bi bi-card-list me-2"></i>挑戰清單
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/createChallenge" class="dropdown-item"><i
                                        class="bi bi-flag me-2"></i>發起挑戰
                                </RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/userProfile" class="nav-link"><i class="bi bi-person-circle me-2"></i>個人資訊
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped></style>
