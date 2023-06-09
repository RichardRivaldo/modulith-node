# modulith-node

Modular Monolith Backend Node Application

# Description

CRUD Backend Application made with Modular Monolith architecture, structured with Nx Monorepo.

# Concepts

## Modular Monolith

A monolith system is a system that has one and only one deployment unit. Meanwhile, modularity means a separation of concern based on functionality of each components. It fulfills three main assumptions: independent and interchangeable, has everything necessary to provide for desired functionality, and is encapsulated or has defined interface. A modular monolith system is a monolith system created in modular way.

## Monorepo

A monorepo is a single repository containing multiple distinct projects with well-defined relationships.

## Dissection of Gojek App

In Gojek application, there are many services implemented to support the execution of the application itself. The main service is of course the user service, which organize and is responsible for the user itself. Other than the user, we might see the services are sliced based on their domains. For example, we might see GoFood services, GoRide services, GoMart services, GoSend services, GoPlay services, and much more. These services would likely to be implemented as separate services due to their differences on handling different themes. Gojek would also likely to have its own authorization and authentication services, transaction service which forwards an event generated by user to corresponding services, payment services (including payment using internal payment method such as GoPayLater which might also be implemented as a single service, or external payment gateway such as Jago), GoPay and GoPay coins e-wallet service, and even separate driver service. There are many more features in GoPay, which means that there are also many more services possibly implemented in the Gojek application.

## Implemented Services

In the Kejog application, there will be three services implemented. Aside from user servicen which handles general user things such as updating profiles and authentication-authorization, there are also restaurant service and food order service, namely GoFood. The restaurant service is intended for merchant-side interface, meaning that restaurant merchants can manage and customize their own profile through these services, including adding new menu. The order service is specifically created for users to create food order, and hopefully, through this service, the interaction between the services can be demonstrated.

## Entities Definition

In regards of the services, there will only be several entities defined, including user for user service, restaurant and cuisine service for restaurant service, and order for GoFood service. The definition and relationship of each entities can be seen in the depicted Entity Relationship Diagram shown below. Here is an example of how to interpret the notation I used in the ERD. The restaurant and cuisine is connected with the menu relationship. In this case, a restaurant can have many cuisines menu, but not the other way. Hence, the defined relationship is one-to-many, as represented with arrow and non-arrow end of the line. We also see that a restaurant may not have any menu at all (might be because the merchant hasn't registered any), but not the other way around. In this case, the defined relationship is a partial-to-complete participation, as defined with thick and double lines for each relationship. Note that for simplicity sake, the entities defined are not really detailed.

![ERD for Kejog Entities](docs/img/ERD_Kejog.png 'ERD for Kejog Entities')

# Setting Up

1. Install all the dependencies with `npm install`.
2. Configure the environment variables in `.env`.

# How to Run

## Server

Execute `nx serve modulith-node` to run the server. This will automatically build all the modules defined in Nx, equivalent to running `npx nx build modulith-node`.

## Nx

### Library Generator

Execute `nx g @nx/node:lib <lib_name> --buildable --directory=<dir_path>` to automatically scaffold a new library to the project.

### Module Dependencies Graph

Execute `nx graph` to open up a window in browser to see the dependencies between every modules. Below is the said graph for current modules implementation.

![Module Dependencies Graph for Kejog](docs/img/dependencies_graph.png 'Module Dependencies Graph for Kejog')

# Technical Details

## Technical Stack

1. `Express`-flavoured Node application.
2. `mongoose` as MongoDB ORM.
3. `jsonwebtoken` for Token-based authentication.
4. `bcrypt` for password hashing.
5. `jest` for unit testing.

## Nx as Monorepo

I use Nx as my monorepo and build tool technology. There are several reasons on this pick:

1. Designed for apps built with JavaScript and TypeScript, provides significant helps for frameworks like Node, Nest, Angular, or React, and therefore, chosen as the tool because of stack similarity.
2. Provides code generator and several useful commands, such as deployment and end-to-end testing.
3. Nx provides the ability for developer to either use same version for all dependencies used in the project (by defining global dependency in the `package.json`) or specifically design them for each library or apps built within Nx workspace (which is actually not really recommended, but very useful in certain cases).
4. Pretty nice documentation, brief and has video tutorials.

## Libraries

Nx defines two terms specifically used in Nx workspace domain: `apps` and `libraries`. While `apps` itself is self-explanatory, `libraries` are more into modules or services. In term of the architecture, good definition of libraries is expected to ease migration into the next level: `microservices` if needed.There are several libraries implemented in this project.

1. The `databases` and `middlewares`, which includes `auth` library, is separated from the main module, in hope that extension or changes to technology stack (for example, changing into new database or adding new authentication mechanism) won't be very hard to do.
2. The `modules`, which includes all the `services` implementation, including `user`, `restaurant`, and `gofood`. Each service exposes their `services` and `controllers` that will be used by the main application. We can see from above module dependencies graph that there are interactions between these modules, and these includes code sharing or even using a service as dependencies.

## Endpoints

Endpoints documentation can be accessed in the following [Postman Documentation](https://documenter.getpostman.com/view/15544005/2s93sZ6ZAa).

# Things to Improve

1. Unit test and end-to-end testing implementation. Also, clear-up of unused files generated by Nx.
2. Deeper layer of encapsulation might be needed. In the current implementation, data access repository layer is integrated into the service layer.
3. More details on each entities' informations and business logic implemented.
4. Logging, for example with `Winston` or `Morgan`.
5. Pagination for holistic queries of an entity.
6. Distributed caching provided by Nx.
