<template>
    <div style="margin:20px;height:100%;width:100%;" ref="base">
        <div class="flex-center" style="flex-direction: column;justify-content: start;height: 100%;">
            <div class="flex-center">
                <ButtonGroup @change="openTab = $event" :buttons="['Summary', 'Courses', 'Announcements']"/>
            </div>
            <div class="flex-center">
                <div style="margin-top:20px;overflow-y: auto;width:100%;padding-bottom:100px;overflow-x:none" :style="openTab == 'Courses' ? 'max-width:100%' : 'max-width:0px'">
                    <div v-for="enrollment in activelyShowingEnrollments" style="margin:10px;padding:20px;white-space: nowrap;overflow-x: none;" class="raised-container">
                        <div class="flex-apart">
                            <div class="flex-center">
                                <span class="text f-medium f-bold">{{ enrollment.course_code }}</span>
                                <Lottie @click="toggleOpenEnrollment(enrollment)" :src="'Dropdown.json'" :mode="'loop'" style="width:20px;margin-left:10px" :style="openEnrollments.includes(enrollment) ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)'" :background="'transparent'"/>
                            </div>
                            <div :style="openEnrollments.includes(enrollment) ? 'opacity:0' : 'opacity:1'">
                                <div class="highlight-container">
                                    <span class="text f-small f-bold">96%</span>
                                </div>
                            </div>
                            
                        </div>
                        <div style="overflow-y:hidden;" :style="openEnrollments.includes(enrollment) ? 'max-height:800px' : 'max-height:0px'">
                            <div v-for="todoItem in getTodoInCourse(enrollment.id)" style="margin:5px 10px">
                                <div class="flex-apart">
                                    <div class="flex-center">
                                        <div class="solid-highlight-container">
                                            <span class="text f-small">{{ todoItem.type == "submitting" ? "Assignment" : "Quiz"}}</span>
                                        </div>
                                        <div style="margin-left:10px">
                                            <span class="text f-small f-bold">{{ todoItem.assignment.name }}</span>
                                        </div>
                                        
                                    </div>

                                    <div class="highlight-container">
                                        <span class="text f-small f-bold">{{getTimeUntilDue(todoItem.assignment.due_at)}}</span>
                                    </div>
                                
                                </div>
                                
                                
                            </div>
                            <div class="flex-apart" style="justify-content: end;">
                                <span class="highlight-container text">Open in Canvas</span>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
        
        
    </div>
</template>
<script>
export default {
    name: "Canvas",
    data(){
        return {
            activelyShowingEnrollments: [],
            openEnrollments: [],
            openTab: "Summary"
        }
    },
    methods: {
        getEnrollments(){
            var cObject = this.$store.getters.getCache("canvas");
            console.log(cObject);
            this.activelyShowingEnrollments = cObject.enrollments;
        },
        toggleOpenEnrollment(enrollment){
            if(this.openEnrollments.includes(enrollment)){
                this.openEnrollments.splice(this.openEnrollments.indexOf(enrollment), 1);
            }else{
                this.openEnrollments.push(enrollment);
            }
        },
        getStreamInCourse(courseId){
            var cObject = this.$store.getters.getCache("canvas");
            var stream = cObject.stream.filter(s => s.course_id == courseId);

            return stream;
        },
        getTodoInCourse(courseId){

            var maxDaysInAdvance = 7;
            if(this.$store.getters.getSettingValue("canvas_max_days_advance") != undefined){
                maxDaysInAdvance = parseInt(this.$store.getters.getSettingValue("canvas_max_days_advance"));
            }

            var cObject = this.$store.getters.getCache("canvas");
            var assignments = this.activelyShowingEnrollments.find(e => e.id == courseId).assignments.map(a => {

                var type = "submitting";
                if(a.submission_types.includes("online_quiz")){
                    type = "quiz";
                }

                return {
                    type: type,
                    assignment: a
                }
            });
            
            assignments = assignments.filter(a => {
                if(a.assignment.due_at == undefined || a.assignment.due_at == null){
                    return true;
                }
                var due = new Date(a.assignment.due_at);
                var now = new Date();
                var diff = due.getTime() - now.getTime();
                if(diff > 1000*60*60*24*maxDaysInAdvance){
                    return false;
                }
                return true;
            });

            var sorted = assignments.sort((a, b) => {
                if(a.due_at == undefined || a.due_at == null){
                    return 1;
                }
                if(b.due_at == undefined || b.due_at == null){
                    return -1;
                }
                return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
            });

            return sorted;
        },
        
        getTimeUntilDue(dueDate){

            

            if(dueDate == undefined || dueDate == null){
                return "LOTTIE";
            }

            var due = new Date(dueDate);
            var now = new Date();

            var total = due.getTime() - now.getTime();
            // if more than 48 hours, return number of days
            if(total > 1000*60*60*48){
                return Math.floor(total / (1000*60*60*24)) + "d";
            }
            // if more than 1 hour, return number of hours
            if(total > 1000*60*60){
                return Math.floor(total / (1000*60*60)) + "h";
            }
            // if more than 1 minute, return number of minutes
            if(total > 1000*60){
                return Math.floor(total / (1000*60)) + "m";
            }

            if(total < 0){
                return "OVERDUE";
            }
            // return number of seconds
            return Math.floor(total / 1000) + "s";

            // get most accur
        }
    },
    mounted(){
        setInterval(() => {
            this.getEnrollments();
        }, 1000*20);
        this.getEnrollments();
    }
}
</script>