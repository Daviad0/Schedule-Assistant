<template>
    <div style="margin:20px;height:100%;width:100%;" ref="base">
        <div class="flex-center" style="flex-direction: column;justify-content: start;height: 100%;">
            <div class="flex-center">
                <ButtonGroup @change="openTab = $event" :buttons="['Stream', 'Courses', 'Announcements']"/>
            </div>
            <div class="flex-center" style="height:100%;margin-top:10px;width:100%">
                <div style="margin-top:20px;overflow-y: auto;width:100%;padding-bottom:100px;overflow-x:hidden;height:90%" :style="openTab == 'Stream' ? 'max-width:100%;max-height:100%' : 'max-width:0px;max-height:0px'">
                    <div v-for="streamItem in getStream().filter(s => s.type == 'Message')" style="margin:10px;padding:10px 20px;white-space: nowrap;overflow-x: none;" class="raised-container">
                        <div class="flex-apart">
                            
                            <div class="flex-center">
                                <span class="text f-medium f-bold">Update</span>
                                <div class="solid-highlight-container">
                                    <span class="text f-small">{{ getCourseById(streamItem.course_id).name }}</span>
                                </div>
                                
                                
                            </div>
                
                            
                            <span class="text f-small">{{ streamItem.updated_at == null ? new Date(streamItem.created_at).toLocaleString() : new Date(streamItem.updated_at).toLocaleString() }}</span>
                            
                        </div>
                        <div class="flex-center">
                            <span class="text f-small center block" style="white-space: normal;word-break: break-all;margin:10px" v-html="formatMessage(streamItem.message)"></span>
                        </div>
                        
                    </div>
                </div>
                <div style="margin-top:20px;overflow-y: auto;width:100%;padding-bottom:100px;overflow-x:hidden;height:90%;" :style="openTab == 'Courses' ? 'max-width:100%;max-height:100%' : 'max-width:0px;max-height:0px'">
                    <div v-for="enrollment in activelyShowingEnrollments" style="margin:10px;padding:20px;white-space: nowrap;overflow-x: none;" class="raised-container">
                        <div class="flex-apart">
                            <div class="flex-center">
                                <span class="text f-medium f-bold">{{ enrollment.course_code }}</span>
                                <Lottie @click="toggleOpenEnrollment(enrollment)" :src="'Dropdown.json'" :mode="'loop'" style="width:20px;margin-left:10px" :style="openEnrollments.includes(enrollment) ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)'" :background="'transparent'"/>
                            </div>
                            <div :style="openEnrollments.includes(enrollment) ? 'opacity:0' : 'opacity:1'">
                                <div class="highlight-container">
                                    <span v-if="enrollment.extraData.computed_current_score != null" class="text f-small f-bold" style="white-space: normal;word-break: break-all;">{{ enrollment.extraData.computed_current_score }}</span>
                                    <span v-if="enrollment.extraData.computed_current_score == null" class="text f-small f-bold">N/A</span>
                                </div>
                            </div>
                            
                        </div>
                        <div style="overflow-y:hidden;" :style="openEnrollments.includes(enrollment) ? 'max-height:800px' : 'max-height:0px'">
                            <div v-for="todoItem in getTodoInCourse(enrollment)" style="margin:5px 10px">
                                <div class="flex-apart">
                                    <div class="flex-center">
                                        <div class="solid-highlight-container">
                                            <span class="text f-small">{{ todoItem.type == "submitting" ? "Assignment" : "Quiz"}}</span>
                                        </div>
                                        <div style="margin-left:10px">
                                            <span class="text f-small f-bold">{{ todoItem.assignment.name }}</span>
                                        </div>
                                        
                                    </div>

                                    <div class="highlight-container" :class="getTimeUntilDue(todoItem.assignment.due_at) == 'OVERDUE' ? 'anim-bg-main-flash' : ''">
                                        <span class="text f-small f-bold" v-if="getTimeUntilDue(todoItem.assignment.due_at) != 'LOTTIE' && getTimeUntilDue(todoItem.assignment.due_at) != 'OVERDUE'">{{getTimeUntilDue(todoItem.assignment.due_at)}}</span>
                                        <Lottie :src="'ClockSpin.json'" :mode="'hover'" style="width:20px" :background="'transparent'" v-if="getTimeUntilDue(todoItem.assignment.due_at) == 'LOTTIE'" title="No Due Date Specified"/>
                                        <Lottie :src="'ClockDone2.json'" :mode="'loop'" style="width:20px" :background="'transparent'" v-if="getTimeUntilDue(todoItem.assignment.due_at) == 'OVERDUE'" title="Overdue!"/>
                                    </div>
                                
                                </div>
                                
                                
                            </div>
                            <div class="flex-apart" style="justify-content: end;">
                                <a class="highlight-container text" :href="getBaseCanvasLink() + '/courses/' + enrollment.id" target="_blank">Open in Canvas</a>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
                <div style="margin-top:20px;overflow-y: auto;width:100%;overflow-x:hidden;height:90%" :style="openTab == 'Announcements' ? 'max-width:100%;max-height:100%' : 'max-width:0px;max-height:0px'">
                    <div class="flex-center">
                        <span class="text f-medium center block" style="opacity: 0.7;" v-if="getStream().filter(s => s.type == 'Announcement' || s.type == 'DiscussionTopic').length == 0">No Announcements to see :(</span>
                    </div>
                    
                    <div v-for="streamItem in getStream().filter(s => s.type == 'Announcement' || s.type == 'DiscussionTopic')" style="margin:10px;padding:10px 20px;white-space: nowrap;overflow-x: none;" class="raised-container">
                        <div class="flex-apart">
                            
                            <div class="flex-center">
                                <span class="text f-medium f-bold">{{ s.type == 'DiscussionTopic' ? 'Discussion Post' : 'Announcement' }}</span>
                                <div class="solid-highlight-container">
                                    <span class="text f-small">{{ getCourseById(streamItem.course_id).name }}</span>
                                </div>
                                
                                
                            </div>
                
                            
                            <span class="text f-small">{{ streamItem.updated_at == null ? new Date(streamItem.created_at).toLocaleString() : new Date(streamItem.updated_at).toLocaleString() }}</span>
                            
                        </div>
                        <div class="flex-center">
                            <span class="text f-small center block" style="white-space: normal;word-break: break-all;margin:10px" v-html="getDiscussionEntry(streamItem.root_discussion_entries, streamItem.type == 'Announcement').message"></span>
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
        getStream(){
            var cObject = this.$store.getters.getCache("canvas");
            var stream = cObject.stream;

            stream.sort((a,b) => {
                if(a.updated_at == undefined || a.updated_at == null){
                 a.updated_at = a.created_at;
                }
                if(b.updated_at == undefined || b.updated_at == null){
                 b.updated_at = b.created_at;
                }
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            });

            return stream;
        },
        getCourseById(id){
            var cObject = this.$store.getters.getCache("canvas");
            console.log(cObject);
            var course = cObject.enrollments.filter(e => e.id == id)[0];
            return course;
        },
        getBaseCanvasLink(){
            var baseUrl = this.$store.getters.getSettingValue("canvas_url");
            if(baseUrl.includes("http")){
                return baseUrl;
            }
            return "https://" + baseUrl;
        },
        formatMessage(message){
            var messageParts = message.split("__");
            message = messageParts[0];

            var urlRegex = /(https?:\/\/[^\s]+)/g;
            message = message.replace(urlRegex, function(url) {
                return '<a class="highlight-container text" style="margin:5px" target="_blank" href="' + url + '">' + url + '</a>';
            })

            return message;
        },
        getDiscussionEntry(entries, earlist){
            entires = entries.sort((a,b) => {
                if(earlist){
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })

            return entries[0];
        },
        getTodoInCourse(enrollment){

            var maxDaysInAdvance = 7;
            if(this.$store.getters.getSettingValue("canvas_max_days_advance") != undefined){
                maxDaysInAdvance = parseInt(this.$store.getters.getSettingValue("canvas_max_days_advance"));
            }

            

            var cObject = this.$store.getters.getCache("canvas");
            var assignments = enrollment.assignments.map(a => {

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