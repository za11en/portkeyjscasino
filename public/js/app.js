const { createApp } = Vue;

createApp({
    data() { 
        return { 
            casinos: [], 
            // 1. Make sure these new variables exist:
            slotsData: {}, 
            payments: [], 
            weeklySchedule: [],
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
            // 2. Check the API URL matches your route
            const urlParams = new URLSearchParams(window.location.search);
            const apiUrl = urlParams.get('dev') ? `/api/data?dev=true` : `/api/data`;
            
            console.log("Fetching from:", apiUrl); // Debug log

            const res = await fetch(apiUrl);
            
            if (res.status === 403) { 
                this.error = true; 
            } else { 
                const data = await res.json(); 
                console.log("Data received:", data); // Debug log

                // 3. Map the data correctly
                this.casinos = data.casinos; 
                this.slotsData = data.slots; 
                this.payments = data.payments;
                this.weeklySchedule = data.weekly || []; // Fallback to empty array prevents crash
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
            return this.filter === 'all' ? this.casinos : this.casinos.filter(c => c.bonus_type === this.filter); 
        },
        visibleCasinos() { 
            return this.filteredCasinos.slice(0, this.visibleCount); 
        },
        // 4. Safe computing for the Day Toggle
        currentDayData() {
            if (!this.weeklySchedule || this.weeklySchedule.length === 0) {
                return { day: 'Loading...', rewards: [] };
            }
            return this.weeklySchedule[this.currentDayIndex];
        }
    },
    methods: {
        nextDay() {
            if (this.currentDayIndex < this.weeklySchedule.length - 1) {
                this.currentDayIndex++;
            } else {
                this.currentDayIndex = 0; 
            }
        },
        prevDay() {
            if (this.currentDayIndex > 0) {
                this.currentDayIndex--;
            } else {
                this.currentDayIndex = this.weeklySchedule.length - 1; 
            }
        },
        handleImageError(e) { 
            e.target.style.display='none'; 
            // e.target.parentElement.innerHTML = ... (Optional simplified error handling)
        }
    }
}).mount('#app');

