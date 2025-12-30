
const { createApp } = Vue;

createApp({
    data() { 
        return { 
            casinos: [], 
            slots: [], 
            payments: [], 
            dailyDrops: [], 
            filter: 'all', 
            ageVerified: false, 
            loading: true, 
            error: false, 
            errorRegion: '',
            visibleCount: 9 
        }
    },
    async mounted() {
        if(localStorage.getItem('portkey_age_verified') === 'true') {
            this.ageVerified = true;
        }
        
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const apiUrl = urlParams.get('dev') ? `/api/data?dev=true` : `/api/data`;
            
            const res = await fetch(apiUrl);
            
            if (res.status === 403) { 
                const data = await res.json(); 
                this.error = true; 
                this.errorRegion = data.region; 
            } else { 
                const data = await res.json(); 
                this.casinos = data.casinos; 
                this.slots = data.slots; 
                this.payments = data.payments;
                this.dailyDrops = data.daily_drops;
            }
        } catch (e) { 
            console.error("Failed to fetch data:", e); 
        } finally { 
            this.loading = false; 
        }
    },
    computed: { 
        filteredCasinos() { 
            return this.filter === 'all' 
                ? this.casinos 
                : this.casinos.filter(c => c.bonus_type === this.filter); 
        },
        visibleCasinos() { 
            return this.filteredCasinos.slice(0, this.visibleCount); 
        },
        dailyRewardCasinos() { 
            return this.casinos.filter(c => c.daily_reward); 
        },
        referralCasinos() { 
            return this.casinos.filter(c => c.referral_bonus); 
        },
        todayName() { 
            return new Date().toLocaleDateString('en-US', { weekday: 'long' }); 
        }
    },
    methods: {
        confirmAge() { 
            this.ageVerified = true; 
            localStorage.setItem('portkey_age_verified', 'true'); 
        },
        denyAge() { 
            window.location.href = "https://google.ca"; 
        },
        handleImageError(e) { 
            e.target.style.display='none'; 
            e.target.parentElement.innerHTML = `<div class='text-white font-bold text-xs'>${e.target.alt}</div>`; 
        }
    }
}).mount('#app');

