<template>
    <div id="navbar" class="container">
        <nav class="navbar">
            <div class="nav-left">
                <router-link to="/" class="nav-button">Home</router-link>
            </div>        
            <div class="nav-center">
                <form @submit.prevent="search">
                    <input type="text" v-model="searchTerm" id="search" class="search-input" :placeholder="placeholder" @input="checkChars" maxlength="20" />
                    <button type="submit" class="nav-button search-button">Search</button>
                </form>
            </div>
            <div class="nav-right">
                <template v-if="!this.isAuthenticated">
                    <router-link to="/login" class="nav-button">Login</router-link>
                    <router-link to="/register" class="nav-button">Register</router-link>
                </template>
                <template v-else>
                    <router-link to="/write" class="nav-button">Post</router-link>
                    <router-link to="/follows" class="nav-button">Follows</router-link>
                </template>
            </div>
        </nav>
    </div>
</template>

<style scoped>
.navbar {
    background-color: #000000;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0px;
    border-bottom: 1px solid #FFFFFF;
}

.container {
    margin-top: 70px;
}


.nav-button {
    display: inline-block;
    padding: 10px 20px;
    margin: 10px;
    background-color: #000000;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.3s ease;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
}

.nav-left {
    display: flex;
    align-items: center;
    order: 1;
}

.nav-center {
    display: flex;
    align-items: center;
    justify-content: center;
    order: 2;
}

.nav-right {
    display: flex;
    align-items: center;
    order: 3;
}

.search-input {
    border: 1px solid #EEEEEE;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 20px;
    background-color: #EEEEEE;
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    order: 1;
}

.search-button {
    margin: 5px;
    border: 1px solid #FFFFFF;
    border-radius: 20px;
    order: 2;
    cursor: pointer;
}

.nav-button:hover {
    background-color: #555555;
    box-shadow: 0px 0px 10px #444444;
    transform: scale(1.05);
}

.nav-button:active {
    transition: transform 0.15s;
    transform: scale(0.9);
}
/*Special cases for small width screens, makes navbar smaller.*/
@media (max-width: 768px) {
    .nav-button {
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 5px;
    }
    .search-input {
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 10px;
    }
    .search-button {
        border-radius: 10px;
    }
}
@media (max-width: 520px) {
    .nav-button {
        padding: 4px 8px;
        font-size: 10px;
        border-radius: 4px;
    }
    .search-input {
        padding: 4px 8px;
        font-size: 10px;
        border-radius: 8px;
    }
    .search-button {
        border-radius: 8px;
    }
}
@media (max-width: 420px) {
    .nav-button {
        padding: 3px 6px;
        font-size: 8px;
        border-radius: 3px;
    }
    .search-input {
        padding: 3px 6px;
        font-size: 8px;
        border-radius: 6px;
    }
    .search-button {
        border-radius: 6px;
    }
}
</style>  

<script>
export default {
    name: "Navbar",
    data() {
        return {
            searchTerm: "",
            placeholder: "Search user...",
            searchCooldown: false
        }
    },
    computed : {
        isAuthenticated() {
            return this.$store.state.isAuthenticated;
        }
    },
    methods: {
        search() {
            if(this.searchCooldown) {
                return;
            }
            const searchQuery = this.searchTerm;
            this.searchTerm = "";
            if(searchQuery === "") {
                if(this.placeholder !== "Write something!") {
                    this.placeholder = "Write something!";
                    setTimeout(() => {
                        this.placeholder = "Search user...";
                    }, 3000);
                }
                return;
            }
            const path = "/search/" + searchQuery;
            this.$router.push({path:path});
            this.searchCooldown = true;
            setTimeout(() => {
                this.searchCooldown = false;
            }, 1000);
        },
        checkChars() {
            this.searchTerm = this.searchTerm.replace(/[^-_.a-zA-Z0-9]/g, '');
        }
    }
}
</script>
