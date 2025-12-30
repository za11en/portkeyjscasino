const { createApp } = Vue;

createApp({
    data() { 
        return { 
            casinos: [], 
            slotsData: {}, 
            payments: [], 
            weeklySchedule: [], // Initialized as empty array
            skillArticles: [],
            currentDayIndex: 0, 
            filter: 'all', 
            loading: true, 
            error: false, 
            visibleCount: 9 
        }
    },
    async mounted() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            // Use 'api/data' to match your router
            const apiUrl = urlParams.get('dev') ? `/api/data?dev=true` : `/api/data`;
            
            const res = await fetch(apiUrl);
            
            if (res.status === 403) { 
                this.error = true; 
            } else { 
                const data = await res.json(); 
                
                // --- SAFE ASSIGNMENT ---
                // We use '|| []' to ensure we never get 'undefined' if data is missing
                this.casinos = data.casinos || [];
                this.slotsData = data.slots || {}; 
                this.payments = data.payments || [];
                this.weeklySchedule = data.weekly || []; 
                this.skillArticles = data.articles || [];
            }
        } catch (e) { 
            console.error("Fetch Error:", e); 
        } finally { 
            this.loading = false; 
        }
    },
    computed: { 
        filteredCasinos() { 
            if (!this.casinos) return [];
            return this.filter === 'all' ? this.casinos : this.casinos.filter(c => c.bonus_type === this.filter); 
        },
        visibleCasinos() { 
            return this.filteredCasinos.slice(0, this.visibleCount); 
        },
        currentDayData() {
            // --- CRITICAL FIX ---
            // If weeklySchedule is empty or undefined, return a placeholder to prevent crash
            if (!this.weeklySchedule || this.weeklySchedule.length === 0) {
                return { 
                    day: 'Loading...', 
                    rewards: [] // Empty rewards array prevents v-for crash
                };
            }
            // Safely access the index
            return this.weeklySchedule[this.currentDayIndex] || { day: 'Error', rewards: [] };
        },
        todayName() { 
            return new Date().toLocaleDateString('en-US', { weekday: 'long' }); 
        }
    },
    methods: {
        nextDay() {
            if (!this.weeklySchedule.length) return;
            if (this.currentDayIndex < this.weeklySchedule.length - 1) {
                this.currentDayIndex++;
            } else {
                this.currentDayIndex = 0; 
            }
        },
        prevDay() {
            if (!this.weeklySchedule.length) return;
            if (this.currentDayIndex > 0) {
                this.currentDayIndex--;
            } else {
                this.currentDayIndex = this.weeklySchedule.length - 1; 
            }
        },
        handleImageError(e) { 
            e.target.style.display='none'; 
        }
    }
}).mount('#app');

