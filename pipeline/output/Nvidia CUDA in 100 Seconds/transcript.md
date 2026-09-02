# Nvidia CUDA in 100 Seconds

Cuda a parallel Computing platform that allows you to use your GPU for more than just playing video games compute unified device architecture was developed by Nvidia in 2007 based on the prior work

of Ian buck and John Nichols since then Cuda has revolutionized the World by allowing humans to compute large blocks of data in parallel which is unlock the true potential of the deep neural

networks behind artificial intelligence the graphics Processing Unit or GPU is historically used for what the name implies to compute Graphics when you play a game in 1080p at 60 FPS you've

got over 2 million pixels on the screen that may need to be recalculated after every frame which requires Hardware that can do a lot of matrix multiplication and Vector transformations in parallel

and I mean a lot modern gpus are measured in teraflops or how many trillions of floating Point operations can it handle per second unlike modern CPUs like the Intel I9 which has 24

cores a modern GPU like the RTX 490 has over 16,000 cores a CPU is designed to be versatile while a GPU is designed to go really fast in parallel Cuda allows developers to tap into the gpu's power

and data scientists all around the world are using at this very moment trying to train the most powerful machine learning models it works like this you write a function called a Cuda kernel that runs

on the GPU you then copy some data from your main Ram over to the gpu's memory then the CPU will tell the GPU to execute that function or kernel in parallel the code is executed in a block

which itself organizes threads into a multi-dimensional grid then the final result from the GPU is copied back to the main memory a piece of cake let's go ahead and build a Cuda application right

now first you'll need an Nvidia GPU then install the Cuda toolkit Cuda includes device drivers a runtime compilers and Dev tools but the actual code is most often written in C++ as I'm doing here

in Visual Studio first we use the global specifier to define a function or Cuda kernel that runs on the actual GPU this function adds two vectors or arrays together it takes pointer arguments A

and B which are the two vectors to be added together and pointer C for the result C equals a plus b but because hypothetically we're doing billions of operations in parallel we need to

calculate the global index of the thread in the block that we're working on from there we can use managed which tells Cuda this data can be accessed from both the host CPU and the device GPU without

the need to manually copy data between them and now we can write a main function for the CPU that runs the Cuda kernel we use a for Loop to initialize our arrays with data then from there we

pass this data to the ad function to run it on the GPU but you might be wondering what these weird triple brackets are they allow us to configure the Cuda kernel launch to control how many blocks

and how many threads per block are used to run this code in parallel and that's crucial for optimizing multi-dimensional data structures like tensors used in deep learning from there Cuda device

synchronize will pause the execution of this code and wait for it to complete on the GPU when it finishes and copies the data back to the host machine we can then use the result and print it to the

standard output now let's execute this code with Auda compiler by clicking the play button congratulations you just ran 256 threads in parallel on your GPU but if you want to go beyond nvidia's GTC

conference is coming up in a few weeks it's free to attend virtually featuring talks about building massive parallel systems with Cuda thanks for watching and I will see you in the next one
