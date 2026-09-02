[00:00:00] Cuda a parallel Computing platform that
[00:00:02] allows you to use your GPU for more than
[00:00:05] just playing video games compute unified
[00:00:07] device architecture was developed by
[00:00:09] Nvidia in 2007 based on the prior work
[00:00:11] of Ian buck and John Nichols since then
[00:00:14] Cuda has revolutionized the World by
[00:00:16] allowing humans to compute large blocks
[00:00:17] of data in parallel which is unlock the
[00:00:19] true potential of the deep neural
[00:00:21] networks behind artificial intelligence
[00:00:23] the graphics Processing Unit or GPU is
[00:00:25] historically used for what the name
[00:00:27] implies to compute Graphics when you
[00:00:29] play a game in 1080p at 60 FPS you've
[00:00:31] got over 2 million pixels on the screen
[00:00:33] that may need to be recalculated after
[00:00:35] every frame which requires Hardware that
[00:00:37] can do a lot of matrix multiplication
[00:00:39] and Vector transformations in parallel
[00:00:41] and I mean a lot modern gpus are
[00:00:43] measured in teraflops or how many
[00:00:45] trillions of floating Point operations
[00:00:46] can it handle per second unlike modern
[00:00:48] CPUs like the Intel I9 which has 24
[00:00:51] cores a modern GPU like the RTX 490 has
[00:00:54] over 16,000 cores a CPU is designed to
[00:00:57] be versatile while a GPU is designed to
[00:01:00] go really fast in parallel Cuda allows
[00:01:02] developers to tap into the gpu's power
[00:01:04] and data scientists all around the world
[00:01:06] are using at this very moment trying to
[00:01:07] train the most powerful machine learning
[00:01:09] models it works like this you write a
[00:01:11] function called a Cuda kernel that runs
[00:01:13] on the GPU you then copy some data from
[00:01:15] your main Ram over to the gpu's memory
[00:01:18] then the CPU will tell the GPU to
[00:01:20] execute that function or kernel in
[00:01:22] parallel the code is executed in a block
[00:01:24] which itself organizes threads into a
[00:01:26] multi-dimensional grid then the final
[00:01:27] result from the GPU is copied back to
[00:01:30] the main memory a piece of cake let's go
[00:01:31] ahead and build a Cuda application right
[00:01:33] now first you'll need an Nvidia GPU then
[00:01:36] install the Cuda toolkit Cuda includes
[00:01:38] device drivers a runtime compilers and
[00:01:40] Dev tools but the actual code is most
[00:01:42] often written in C++ as I'm doing here
[00:01:44] in Visual Studio first we use the global
[00:01:47] specifier to define a function or Cuda
[00:01:49] kernel that runs on the actual GPU this
[00:01:51] function adds two vectors or arrays
[00:01:54] together it takes pointer arguments A
[00:01:55] and B which are the two vectors to be
[00:01:57] added together and pointer C for the
[00:01:59] result C equals a plus b but because
[00:02:02] hypothetically we're doing billions of
[00:02:03] operations in parallel we need to
[00:02:05] calculate the global index of the thread
[00:02:07] in the block that we're working on from
[00:02:08] there we can use managed which tells
[00:02:10] Cuda this data can be accessed from both
[00:02:12] the host CPU and the device GPU without
[00:02:15] the need to manually copy data between
[00:02:17] them and now we can write a main
[00:02:18] function for the CPU that runs the Cuda
[00:02:20] kernel we use a for Loop to initialize
[00:02:22] our arrays with data then from there we
[00:02:24] pass this data to the ad function to run
[00:02:27] it on the GPU but you might be wondering
[00:02:29] what these weird triple brackets are
[00:02:30] they allow us to configure the Cuda
[00:02:32] kernel launch to control how many blocks
[00:02:34] and how many threads per block are used
[00:02:36] to run this code in parallel and that's
[00:02:37] crucial for optimizing multi-dimensional
[00:02:39] data structures like tensors used in
[00:02:41] deep learning from there Cuda device
[00:02:43] synchronize will pause the execution of
[00:02:45] this code and wait for it to complete on
[00:02:47] the GPU when it finishes and copies the
[00:02:49] data back to the host machine we can
[00:02:51] then use the result and print it to the
[00:02:52] standard output now let's execute this
[00:02:54] code with Auda compiler by clicking the
[00:02:56] play button congratulations you just ran
[00:02:58] 256 threads in parallel on your GPU but
[00:03:01] if you want to go beyond nvidia's GTC
[00:03:03] conference is coming up in a few weeks
[00:03:05] it's free to attend virtually featuring
[00:03:07] talks about building massive parallel
[00:03:08] systems with Cuda thanks for watching
[00:03:10] and I will see you in the next one
