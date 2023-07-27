import { Header } from "./components/Header";
import { Tasks } from "./components/Tasks";
import { AddTask } from "./components/AddTask";
import {useState, useEffect} from 'react';

function App() {

  const [tasks, setTasks] =useState( []);

  // const [nextid, setNextid] =useState(3)

  const [showAddTask, setShowAddTask] = useState(false);

  const deleteTask = async (id) =>{
    await fetch (`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})

    setTasks(tasks.filter(task => task.id !== id))
  }

  useEffect(()=>{
    const getTasks = async () =>{
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer)
    }

    getTasks();
  }, [])

  const fetchTasks = async ()=>{
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();

    return data;
  }

  const fetchTask = async id=>{
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data;
  }

  const toggleReminder = async (id) =>{
    const takskToToggle = await fetchTask(id);
    console.log(takskToToggle);
    const updatedTask = {...takskToToggle, reminder: !takskToToggle.reminder};

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()
    setTasks(tasks.map(task => task.id === id ? {...task, reminder: data.reminder}: task))
    
  }

  const addTask = async (task) =>{
    const res = await fetch(`http://localhost:5000/tasks/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
    body: JSON.stringify(task)});

    const data = await res.json();

    setTasks([...tasks, data])

    // const newTask = {
    //     id: nextid, ...task
    // }
    // setNextid(nextid + 1)
    // setTasks([...tasks, newTask])
  }

  return (
    <div className="container">
        <Header onAdd={()=> setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
        {showAddTask && <AddTask onAdd={addTask}/>}
        {tasks.length > 0 ?
          <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
          : 'no tasks'
        }
    </div>
  );
}

export default App;
