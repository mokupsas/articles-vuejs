<template>

    <div class="mt-6 mb-6">
        <h1 class="title">About</h1>
        <hr/>

        <div class="block">
            <h2 class="mb-1">Task</h2>
            <p>The purpose of this task is to make sense of and expand the existing knowledge of vue.js practically and theoretically.</p>
            <p>Website has to use <a href="https://github.com/typicode/json-server">json-server</a>, to emulate the API.</p>
        </div> 

        <div class="block">
            <h2 class="mb-1">JSON-SERVER database structure</h2>
            <p>The json-server will have to consist of the following tables:</p>
            <ul>
                <li>- Authors</li>
                <li>- Articles</li>
            </ul>

            <p class="mt-4">The authors table:</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>id</td>
                        <td>integer</td>
                    </tr>
                    <tr>
                        <td>name</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>created_at</td>
                        <td>datetime</td>
                    </tr>
                    <tr>
                        <td>updated_at</td>
                        <td>datetime</td>
                    </tr>
                </tbody>
            </table>

            <p class="mt-4">The articles table:</p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>id</td>
                        <td>integer</td>
                    </tr>
                    <tr>
                        <td>title</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>body</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>author</td>
                        <td>integer / id from author table</td>
                    </tr>
                    <tr>
                        <td>created_at</td>
                        <td>datetime</td>
                    </tr>
                    <tr>
                        <td>updated_at</td>
                        <td>datetime</td>
                    </tr>
                </tbody>
            </table>      
        </div>  

        <div class="block">
            <h2 class="mb-1">Pages</h2>
            <p>The website must consist of the following pages:</p>
            <ul>
                <li>- Post page</li>
                <li>- Post detail page</li>
            </ul>
        </div>


        <div class="block">
            <h2 class="mb-1">Functionality</h2>
            <p>In order to perform the current task, the website must be able to perform the following functionality:</p>
            <ul>
                <li>- List of articles must be paginated</li>
                <li>- Display messages to user, when no articles were found</li>
                <li>- Articles page must have a search functionality</li>
                <li>- The list of authors must be static and fetched from json-server</li>
                <li>- Modal window must be used to create, edit or delete selected post</li>
                <li>- Same modal window must be used for creating, editing and deleting posts</li>
                <li>- Editing and deletion must be possible from any page. Both posts list or post detail page</li>
                <li>- The message must be shown to user on successful or unsuccessful actions with editing post</li>
                <li>- Input must be validated</li>
                <li>- Minimal design must be created using <a href="https://bulma.io/">BULMA</a></li>
            </ul>
        </div> 

    </div>

</template>

<script>
</script>

<style>
h2 {
    font-size: 24px;
}
</style>