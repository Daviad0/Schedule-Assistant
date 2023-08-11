<template>
    <div class="raised-container blur-bg flex-apart" style="width:100%;height:100%;flex-direction: column;">
        <div class="flex-center" style="margin:20px 0px;width:100%">
            <span class="text f-xlarge f-bold">Settings</span>
        </div>
        <div style="height:100%;width:100%;overflow-y:auto">
            <div v-for="category in categoriesToShow()" style="margin:10px 20px;margin-bottom: 40px;">
                <span class="text f-xlarge f-bold" style="text-align: left;margin-left:5px">{{ category.display }}</span>
                <hr class="text" style="opacity: 0.2;margin-top:15px"/>
                <div style="padding-top: 10px;">
                    <div v-for="setting in getSettingsInCategory(category)">
                        <div class="flex-apart" style="margin:15px 20px">
                            <span class="text f-large">{{setting.display}}</span>
                            <div class="dotted-line" style="flex:1;margin:0px 20px">

                            </div>
                            <div>
                                <div v-if="setting.type == 'dropdown'">
                                    <Dropdown @change="setSettingValue(setting.id, $event)" :value="getSettingValue(setting.id)" :options="setting.options.map(o => o.display)" :optionids="setting.options.map(o => o.id)" :initwidth="'400px'" :id="setting.id"/>
                                </div>
                                <div v-if="setting.type == 'number'">
                                    <input :value="getSettingValue(setting.id) != undefined ? getSettingValue(setting.id) : ''" @change="setSettingValue(setting.id, $event.srcElement.value)" class="light-container transparent-border text f-medium" style="text-align: left;width:200px" type="number" :placeholder="setting.placeholder">
                                </div>
                                
                            </div>
                        </div>

                    </div>
                </div>
                
            </div>
            <div style="height:200px">

            </div>
            
        </div>
        <div class="flex-center" style="margin-right:25px;margin-bottom:10px;width:100%;justify-content: end;">
            <Lottie :src="'Checkmark2.json'" :mode="'click'" :background="'transparent'" style="width:60px"/>
        </div>
    </div>

</template>
<script>
export default {
    name: "SettingsOverlay",
    props: {
       
    },
    data: () => {
        return {
            settings: [
                {
                    id: 'sched_week_sun_sat', // done
                    display: 'Display Saturday & Sunday in Week Mode', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'yes',
                            display: 'Yes'
                        },
                        {
                            id: 'no',
                            display: 'No'
                        },
                        {
                            id: 'only_if_events',
                            display: 'Only if Events are Present'
                        }

                    ]
                },
                {
                    id: 'sched_week_display_expired_items', // done except delete
                    display: 'Display Already Completed Items (in Week Mode)', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'yes',
                            display: 'Yes'
                        },
                        {
                            id: 'no',
                            display: 'No'
                        },
                        {
                            id: 'do_not_delete',
                            display: 'No, but do not delete them'
                        }

                    ]
                },
                {
                    id: 'sched_today_display_expired_items', // done except delete
                    display: 'Display Already Completed Items (in Today Mode)', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'yes',
                            display: 'Yes'
                        },
                        {
                            id: 'no',
                            display: 'No'
                        },
                        {
                            id: 'do_not_delete',
                            display: 'No, but do not delete them'
                        }

                    ]
                },
                {
                    id: 'sched_snooze_item_mode', // done
                    display: 'Item Snoozing Function', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'enable_hide',
                            display: 'Enable, Hide Item'
                        },
                        {
                            id: 'enable_minimize',
                            display: 'Enable, Minimize Item'
                        },
                        {
                            id: 'disable',
                            display: 'Disable'
                        }
                        

                    ]
                    
                },
                {
                    id: 'sched_flash_up_next',
                    display: 'Minutes Before to Flash Up Next', 
                    type: 'number',
                    placeholder: '0 = No Flash'
                },
                {
                    id: 'check_hide_completed_items', // done
                    display: 'Minutes to Hide Completed Items', 
                    type: 'number',
                    placeholder: '0 = Instant'
                },
                {
                    id: 'check_flash_progress_at_percent',
                    display: 'Progress % to Flash Item', 
                    type: 'number',
                    placeholder: '0 = No Flash'
                },
                {
                    id: 'check_show_finished_progress',
                    display: 'Show Progress after Finished', 
                    type: 'number',
                    placeholder: '0 = No Flash'
                },
                {
                    id: 'check_show_encouraging_message',
                    display: 'Show Encouraging Message when Finished', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'disable',
                            display: 'Disable'
                        },
                        {
                            id: 'at_random',
                            display: 'Show At Random'
                        },
                        {
                            id: 'always',
                            display: 'Show Always'
                        }
                        

                    ]
                },
                {
                    id: 'check_progress_color',
                    display: 'Progress Color Mode', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'one_color',
                            display: 'Single Color'
                        },
                        {
                            id: 'red_when_due',
                            display: 'Red When Due'
                        },
                        {
                            id: 'purple_to_red',
                            display: 'Gradient from Purple to Red'
                        }
                        

                    ]
                },
                {
                    id: 'check_category_sort',
                    display: 'Category Sort Mode', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'alphabetical',
                            display: 'Alphabetical'
                        },
                        {
                            id: 'recently_used',
                            display: 'Most Recently Used'
                        },
                        {
                            id: 'due_soon',
                            display: 'Least Time Until Due'
                        }
                        

                    ]
                },
                {
                    id: 'panel_mode',
                    display: 'Mode of Bottom Panel', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'disable',
                            display: 'Do Not Show'
                        },
                        {
                            id: 'leds',
                            display: 'Control LEDs'
                        },
                        {
                            id: 'battery',
                            display: 'Control Battery'
                        },
                        {
                            id: 'clock',
                            display: 'Clock Mode'
                        }
                        

                    ]
                },
                {
                    id: 'panel_auto_hide',
                    display: 'Automatically Hide Bottom Panel', 
                    type: 'dropdown',
                    options: [
                        {
                            id: 'keep_open',
                            display: 'Keep Open'
                        },
                        {
                            id: 'auto_hide',
                            display: 'Auto Hide'
                        }
                        

                    ]
                },


            ],
            categories: [
                {
                    prefix: 'sched',
                    display: 'Scheduling'
                },
                {
                    prefix: 'check',
                    display: 'Checklist'
                },
                {
                    prefix: 'panel',
                    display: 'Bottom Panel'
                }
            ]
        }
    },

    methods: {
        categoriesToShow(){
            if(this.showcategory == undefined){
                return this.categories;
            }else{
                return this.categories.filter(category => category.id == this.showcategory);
            }
        },
        getSettingsInCategory(category){
            return this.settings.filter(setting => setting.id.startsWith(category.prefix));
        },
        setSettingValue(id, value){
            this.$store.commit('setSettingValue', {id: id, value: value});
            console.log(this.getSettingValue(id));
        },
        getSettingValue(id){
            
            var val = this.$store.getters.getSettingValue(id);
            console.log("GOT SETTING", id, val);
            return val;
        }
    }
}
</script>