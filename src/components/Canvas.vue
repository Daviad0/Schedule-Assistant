<template>
    <div style="margin:20px;height:100%;width:100%;padding:20px;border-radius: 16px;" class="dashed-border" ref="base">
        <div class="flex-center" style="flex-direction: column;justify-content:start;height: 100%;" v-if="ready">
            <div class="flex-apart" style="width:100%">
                <div class="flex-center" style="justify-content: start;">
                    <img style="height:60px" :src="getTitleImage()"/>
                    <span style="margin-left:20px" class="text f-medium f-bold">Canvas</span>
                </div>
                
                <div class="flex-center">
                    <ButtonGroup @change="openTab = $event" :buttons="['Stream', 'Courses', 'Announcements']"/>
                </div>
            </div>
            
            <div class="flex-center" style="height:80%;margin-top:10px;width:100%">
                <div style="margin-top:20px;overflow-y: auto;width:100%;overflow-x:hidden;height:100%" :style="openTab == 'Stream' ? 'max-width:100%;max-height:100%' : 'max-width:0px;max-height:100%'">
                    <div class="flex-center" v-if="stream.length == 0" style="margin-top:50px;white-space: nowrap;">
                        <span class="text f-medium center block" style="opacity: 0.7;">Your Stream is Empty :(</span>
                    </div>
                    <div v-for="streamItem in stream" style="margin:10px;padding:10px 20px;white-space: nowrap;overflow-x: none;" class="raised-container">
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
                <div style="margin-top:20px;overflow-y: auto;width:100%;overflow-x:hidden;height:100%;" :style="openTab == 'Courses' ? 'max-width:100%;max-height:100%' : 'max-width:0px;max-height:100%'">
                    <div v-for="enrollment in activelyShowingEnrollments" style="margin:10px;padding:20px;white-space: nowrap;overflow-x: none;" class="raised-container">
                        <div class="flex-apart">
                            <div class="flex-center">
                                <span class="text f-medium f-bold">{{ enrollment.name }}</span>
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
                <div style="margin-top:20px;overflow-y: auto;width:100%;overflow-x:hidden;height:100%" :style="openTab == 'Announcements' ? 'max-width:100%;max-height:100%' : 'max-width:0px;max-height:100%'">
                    <div class="flex-center" style="margin-top:50px;white-space: nowrap;" v-if="announcements.length == 0">
                        <span class="text f-medium center block" style="opacity: 0.7;">No Announcements to see :(</span>
                    </div>
                    
                    <div v-for="streamItem in announcements" style="margin:10px;padding:10px 20px;white-space: nowrap;overflow-x: none;" class="raised-container">
                        <div class="flex-apart">
                            
                            <div class="flex-center">
                                <span class="text f-medium f-bold">{{ streamItem.type == 'DiscussionTopic' ? 'Discussion Post' : 'Announcement' }}</span>
                                <div class="solid-highlight-container">
                                    <span class="text f-small">{{ getCourseById(streamItem.course_id).name }}</span>
                                </div>
                                <Lottie @click="toggleOpenAnnouncement(streamItem.id)" :src="'Dropdown.json'" :mode="'loop'" style="width:20px;margin-left:10px" :style="expandedAnnouncements.includes(streamItem.id) ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)'" :background="'transparent'"/>
                                
                                
                            </div>
                
                            
                            <span class="text f-small">{{ streamItem.updated_at == null ? new Date(streamItem.created_at).toLocaleString() : new Date(streamItem.updated_at).toLocaleString() }}</span>
                            
                        </div>
                        <div class="flex-center" style="overflow-y:hidden" :style="expandedAnnouncements.includes(streamItem.id) ? 'max-height:100vh' : 'max-height:0px'">
                            <span class="text f-small center block" style="white-space: normal;word-break: break-all;margin:10px" v-html="getDiscussionEntry(streamItem)"></span>
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
            openTab: "Summary",
            ready: false,
            expandedAnnouncements: [],
            stream: [],
            announcements: []
        }
    },
    methods: {
        getTitleImage(){
            var cObject = this.$store.getters.getCache("canvas");
            var image = cObject.brand["ic-brand-header-image"];
            if(cObject.brand == undefined) return "";
            return image;
        },
        getEnrollments(){
            var cObject = this.$store.getters.getCache("canvas");
            console.log(cObject);

            var enrollments = cObject.enrollments;
            
            this.activelyShowingEnrollments = enrollments;
            //this.ready = true;

        },
        toggleOpenAnnouncement(announcementId){
            if(this.expandedAnnouncements.includes(announcementId)){
                this.expandedAnnouncements.splice(this.expandedAnnouncements.indexOf(announcementId), 1);
            }else{
                this.expandedAnnouncements.push(announcementId);
            }
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
            var ignoredCourses = this.$store.getters.getSettingValue("canvas_ignore_courses");
            if(ignoredCourses == undefined){
                ignoredCourses = [];
            }

            stream = stream.filter(s => !ignoredCourses.includes(s.course_id));

            var maxDaysRecent_Updates = 7;
            if(this.$store.getters.getSettingValue("canvas_recent_days_show_updates") != undefined){
                maxDaysRecent_Updates = parseInt(this.$store.getters.getSettingValue("canvas_recent_days_show_updates"));
            }

            var maxDaysRecent_Announcements = 7;
            if(this.$store.getters.getSettingValue("canvas_recent_days_show_announcements") != undefined){
                maxDaysRecent_Announcements = parseInt(this.$store.getters.getSettingValue("canvas_recent_days_show_announcements"));
            }

            stream = stream.filter(s => {
                if(s.updated_at == undefined || s.updated_at == null){
                    s.updated_at = s.created_at;
                }
                var diff = new Date().getTime() - new Date(s.updated_at).getTime();
                if((s.type == "Announcement" || s.type == "DiscussionTopic") && diff > 1000*60*60*24*maxDaysRecent_Announcements){
                    return false;
                }
                if((s.type != "Announcement" && s.type != "DiscussionTopic") && diff > 1000*60*60*24*maxDaysRecent_Updates){
                    return false;
                }
                return true;
            });


            stream.sort((a,b) => {


                if(a.updated_at == undefined || a.updated_at == null){
                 a.updated_at = a.created_at;
                }
                if(b.updated_at == undefined || b.updated_at == null){
                 b.updated_at = b.created_at;
                }
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
            });

            this.stream = stream.filter(s => s.type == "Message");
            this.announcements = stream.filter(s => s.type == "Announcement" || s.type == "DiscussionTopic");

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
        getDiscussionEntry(item){
            var entries = item.root_discussion_entries;
            var baseMessage = item.message;
            var earlist = true;

            entries = entries.sort((a,b) => {
                if(earlist){
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                }
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            })

            if(entries.length == 0){

                baseMessage = baseMessage.replace("<a ", "<a class='highlight-container text' style='margin:5px' target='_blank' ");

                return baseMessage;
            }



            return entries[0].message;
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
        },
        checkIfReady(){
            if(this.$store.getters.getCache("canvas") != undefined && this.$store.getters.getCache("canvas").enrollments != undefined){
                console.log("Here's what I think is appropriate to show the Canvas module for", this.$store.getters.getCache("canvas"));
                this.ready = true;
                this.getEnrollments();
                this.getStream();
                console.log("Enrollments", this.activelyShowingEnrollments);
            }
        },
        updateThings(){
            this.$store.dispatch("canvas_updateCache");
        }
    },
    mounted(){
        setInterval(() => {
            if(this.ready) this.checkIfReady();
            else this.getEnrollments();
        }, 1000*20);

        setInterval(() => {
            if(this.ready) {
                this.updateThings();
                this.getStream();
                this.getEnrollments();
                
            }
        
        }, 1000*5);
        this.checkIfReady();
    }
}
</script>