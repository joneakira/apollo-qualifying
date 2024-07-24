# J. Akira Qualification test for Apollo Solutions

```
yarn start
```

- runs both front-end and back-end

- This project aims to manage user accounts and transactions efficiently using modern React libraries and state management solutions. The key technologies used in this project are `react-query`, `react-hook-form`, `react-router-dom`, and `recoil`. Below, we explain why each of these technologies was chosen and how they contribute to the overall functionality and performance of the application.

## Technologies Used

### 1. `react-query`

#### Reasons for Choosing:

- **Efficient Server State Management**: `react-query` provides a robust solution for managing server state. It handles data fetching, caching, synchronization, and more, reducing the need for boilerplate code and making the app more efficient.
- **Auto-Refetching**: It automatically refetches data in the background to keep the client in sync with the server, ensuring that users always see the most up-to-date information.
- **Improved User Experience**: With built-in support for pagination, background updates, and optimistic updates, `react-query` enhances the user experience by providing faster and more responsive interfaces.

### 2. `react-hook-form`

#### Reasons for Choosing:

- **Simplicity and Performance**: `react-hook-form` is known for its simplicity and high performance. It minimizes re-renders and provides a cleaner API for handling form state and validation.
- **Integration with UI Libraries**: It easily integrates with popular UI libraries like Ant Design, making it straightforward to build complex forms with custom validation rules.
- **Improved Developer Experience**: The hook-based approach of `react-hook-form` aligns well with React's functional components, leading to a more intuitive and maintainable codebase.

### 3. `react-router-dom`

#### Reasons for Choosing:

- **Declarative Routing**: `react-router-dom` allows for declarative routing in React applications, making it easier to manage and understand navigation within the app.
- **Dynamic Routing Capabilities**: It supports dynamic route matching and nested routes, which are essential for building complex applications with a hierarchical structure.
- **Community and Ecosystem**: Being one of the most widely used routing libraries for React, it has a large community, extensive documentation, and numerous resources for support.

### 4. `recoil`

#### Reasons for Choosing:

- **Simple State Management**: `recoil` offers a simple yet powerful way to manage global state in React applications. It introduces a minimal API for creating and managing state atoms and selectors.
- **Fine-Grained State Control**: `recoil` provides fine-grained control over state, which helps in optimizing component re-renders and improving performance.
- **Concurrent Mode Compatibility**: `recoil` is designed to be compatible with React's Concurrent Mode, making it future-proof and ready for upcoming React features.

## Conclusion

By leveraging these technologies, we aim to create a highly efficient, maintainable, and user-friendly application. Each technology was chosen based on its strengths and how well it complements the overall architecture of the project. Together, they provide a robust foundation for managing user accounts and transactions, ensuring that the application is scalable, performant, and easy to develop.
