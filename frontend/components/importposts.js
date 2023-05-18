import { AddPosts } from "../services/postOptions.js";
import { DownloadSampleCSV } from "../services/downloadCSV.js";

export const ImportPosts = Vue.component("importPosts", {
    template: `
    <div class="container box">
        <div style="width:100%; margin: 10% -19%" class="d-flex justify-content-end">
            <i class="bi bi-plus-square h4" @click="increase"></i>
            <i class="bi bi-dash-square h4" @click="decrease"></i>
            &nbsp&nbsp&nbsp
            <button type="button" style="height:100%;" @click="downloadSampleCSV">Sample CSV</button>
        </div>
        <table style="width:100%; margin:-7% 15%;">
            <tr>
                <td>
                    CSV File
                </td>
                <td>
                    <input type="file" @change="onCSVSelection">
                </td>
            </tr>
            <tr v-for="i in size">
                <td>
                    Image {{i}}
                </td>
                <td>
                    <input type="file" @change="onImageSelection">
                </td>
            </tr>
            <tr>
                <td>
                    
                </td>
                <td>
                    <button type="button" @click="AddPosts">Submit</button>
                </td>
            </tr>
        </table>
    </div>`,

    data: function() {
        return {
            images: new Array(),
            CSVfile: null,
            size: 1,
            sampleCSV: null,
            ActiveUser: this.$store.getters.username
        }
    },

    methods: {
        onCSVSelection(event) {
            this.CSVfile = event.target.files[0]
        },

        onImageSelection(event) {
            this.images.push(event.target.files[0])
        },

        increase() {
            if (this.size < 6) {
                this.size++
            }
        },

        decrease() {
            if (this.size > 1) {
                this.size--
            }
        },

        downloadSampleCSV() {
            DownloadSampleCSV(this.ActiveUser)
            .then(data => {
                const arr = new Uint8Array(data)
                const blob = new Blob([arr], {type: 'text/csv;charset=utf-8'})

                var fileURL = window.URL.createObjectURL(blob)
                var fileLink = document.createElement("a")

                fileLink.href = fileURL
                fileLink.setAttribute(
                    "download",
                    "sample.csv"
                )
                document.body.appendChild(fileLink)

                fileLink.click()
            })
            .then(()=> {
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("Sample CSV file dowmloaded successfully!!!");
            })
        },

        AddPosts() {
            const fd = new FormData();
            fd.append('CSVfile', this.CSVfile)

            for (let i = 0; i < this.images.length; i++) {
                fd.append('image'+i.toString(), this.images[i])
            }

            AddPosts(this.ActiveUser, fd)
            .then(()=>{this.$router.push(`/${this.ActiveUser}`)})
            .then(()=>{
                alertify.set('notifier','position', 'bottom-center');
                alertify.notify("All posts created successfully!!!");
            })
        }
    }
})