# A Laplacian Occasion

Link to [Video](https://www.youtube.com/watch?v=UYc4qoM6iBo), and [website](https://sage-arithmetic-1997b4.netlify.app/)

Laplace's equation is ubiquitous in physics. It turns out you can solve Laplace's equation and other partial differential equations by sampling random walks! 


<img width="494" alt="Screen Shot 2022-11-06 at 1 47 49 PM" src="https://user-images.githubusercontent.com/21654151/200189317-41d81b27-8c22-42a0-a3f6-89e0aefcbd9f.png">

$$
\nabla^2 f = 0
$$

## Inspiration
<img width="444" alt="image" src="https://user-images.githubusercontent.com/25064071/200190084-0a12f008-7ef7-43e3-affc-63df428d9cb3.png">

## Algorithm
<img width="506" alt="image" src="https://user-images.githubusercontent.com/25064071/200190149-ddb9e3f9-8a1a-463b-ab48-7c016dc5a2e0.png">


If $\Omega \subset \mathbb R^n$ is a bounded domain with boundary $\partial \Omega$. We enforce dirichelet boundary conditions by specifying the value of $f$ on the boundary. (The user can choose the domain and the this boundary value function!)

Then we exploit Kakutani's principle: the solution to Laplace's equation at some point $x\in\Omega$ is the expected value of the values at the first intersection of a random walk starting at $x$ with the boundary $\partial \Omega$. 

We can speed up the random walks by reccursively sampling random points on a sphere of radius $R=\inf \{d(x,y):y\in\partial \Omega\}$. Since each point on the sphere is equally likely to be crossed first by the random walker. 

Once we reach a distance under $\epsilon$ of our boundary, we terminate the random walk, sample the boundary value function at the closest point, and use that value to update our expected value of $f(x)$.

We do this for each point in our domain. 

## Applications
Physicists use finite difference methods or finite element methods to solve many PDEs they encounter computationally. However, there are some problems that arise with these methods. First of all, they both require construcing grids. This has some down-sides 
- Working with meshes is hard. Meshes in the wild can come with a host of problems (singularities, self-intersecting faces, and all sorts of horible stuff)
- The FEM/FDM solution does not always converge as fast as we would like it to. I.e. very fine meshes are required to obtain decent results.
- Constructing meshes is computationally expensive and can take hours. 

Enter Monte Carlo methods. (Monte Carlo is just a fancy name for statistical sampling. For instance, the way to measure the area of a circle with monte carlo is to drop many many tiny pins onto a square of known dimensions bounding the circle, and then count the ratio of pins that fall inside the circle vs the ones that fall in the square but outside the circle.)

The solver we are interested in is called the Walk-On-Spheres algorithm. It's a Monte Carlo algorithm that uses random walks and exploits the mean value property of the Laplace equation. It's been known about for some time, but recently researchers have been trying to generalise it to other problems. 

Another type of solver inspired by ray-tracing algorithms, from the graphics industry, may be able to help scientists solve PDEs more efficiently. These are Monte Carlo methods.


## Wishlist

Implement a Poisson solver too.


