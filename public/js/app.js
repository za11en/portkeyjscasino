const { createApp } = Vue;

createApp({
    data() { 
        return { 
            casinos: [], 
            slotsData: {}, // Changed to object to hold categories
            payments: [], 
            weeklySchedule: [],
            skillArticles: [],
            currentDayIndex: 0, // 0 = Today, 1 = Tomorrow, etc.
            filter: 'all', 
            loading: true, 
            error: false, 
            visibleCount: 9 
        }
    },
    async mounted() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const apiUrl = urlParams.get('dev') ? `/api/data?dev=true` : `/api/data`;
            
            const res = await fetch(apiUrl);
            
            if (res.status === 403) { 
                this.error = true; 
            } else { 
                const data = await res.json(); 
                this.casinos = data.casinos; 
                this.slotsData = data.slots; // Now an object {trending:[], high_rtp:[], etc}
                this.payments = data.payments;
                this.weeklySchedule = data.weekly;
                this.skillArticles = data.articles;
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
        // Returns the object for the currently selected Day
        currentDayData() {
            return this.weeklySchedule[this.currentDayIndex] || { day: 'Loading', rewards: [] };
        },
        todayName() { 
            return new Date().toLocaleDateString('en-US', { weekday: 'long' }); 
        }
    },
    methods: {
        nextDay() {
            if (this.currentDayIndex < this.weeklySchedule.length - 1) {
                this.currentDayIndex++;
            } else {
                this.currentDayIndex = 0; // Loop back to start
            }
        },
        prevDay() {
            if (this.currentDayIndex > 0) {
                this.currentDayIndex--;
            } else {
                this.currentDayIndex = this.weeklySchedule.length - 1; // Loop to end
            }
        },
        handleImageError(e) { 
            e.target.style.display='none'; 
            e.target.parentElement.innerHTML = `<div class='text-white font-bold text-[8px] p-1 text-center'>${e.target.alt}</div>`; 
        }
    }
}).mount('#app');

