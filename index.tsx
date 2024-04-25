import { renderToString } from "react-dom/server"; 

type Todo = { id:number, name: string};
const todos: Todo[] = []




async function fetchHandler(request: Request): Promise<Response>{

    const url = new URL(request.url);

    if(url.pathname ==="" ||url.pathname === "/"){

        return new Response(Bun.file("index.html"));
    }

    if(url.pathname==="/todos" && request.method === "GET"){
        return new Response(renderToString(<TodoList todos={todos}/>));
    }

    if (url.pathname === "/todos" && request.method === "POST") {
        const { todo } = await request.json();
        todos.push({
          id: todos.length + 1,
          name: todo,
        });
        return new Response(renderToString(<TodoList todos={todos} />));
      }

    return new Response("Not Found",{status:404});
}

function TodoList(props:{todos: Todo[]}){
    return (
    <ul>
        {   props.todos.length 
            ? props.todos.map((todo) =>
            <li key={`todo-${todo.id}`}>{todo.name}</li>): "No To do Found"
        }
    </ul>
    )
}

const server = Bun.serve({
    hostname: "localhost",
    port: 3000,
    fetch:fetchHandler
})


console.log(`bun todo running on server ${server.hostname}:${server.port}`);
