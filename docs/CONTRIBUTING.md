# Contributing to ShopHub E-Commerce Platform

First off, thank you for considering contributing to ShopHub! It's people like you that make ShopHub such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](#code-of-conduct). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, Node version, MongoDB version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the JavaScript/CSS styleguides
- End all files with a newline
- Avoid platform-dependent code

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` - Improve structure/format of code
  - ⚡ `:zap:` - Improve performance
  - 🔥 `:fire:` - Remove code/files
  - 🐛 `:bug:` - Fix bug
  - ✨ `:sparkles:` - Introduce new features
  - 📝 `:memo:` - Add/update documentation
  - 🚀 `:rocket:` - Deploy stuff
  - 💄 `:lipstick:` - Add/update UI
  - ✅ `:white_check_mark:` - Add tests
  - 🔒 `:lock:` - Fix security issues
  - ⬆️ `:arrow_up:` - Upgrade dependencies
  - ⬇️ `:arrow_down:` - Downgrade dependencies

### JavaScript Styleguide

- Use ES6+ syntax
- Use arrow functions `() => {}` instead of `function() {}`
- Use `const` by default, `let` when you need to reassign
- Use template literals for string concatenation
- Use meaningful variable names
- Add comments for complex logic
- 2 spaces for indentation

Example:

```javascript
// Good
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

// Bad
function get_user(id) {
  var user = User.findById(id);
  return user;
}
```

### React Component Styleguide

- Use functional components with hooks
- Use destructuring for props
- Name components with PascalCase
- Use meaningful prop names
- Add PropTypes or TypeScript types
- Keep components small and focused

Example:

```javascript
// Good
const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, image } = product;

  return (
    <div className="card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p>${price}</p>
      <button onClick={() => onAddToCart(product)}>Add to Cart</button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
```

### Backend API Styleguide

- Use RESTful conventions
- Return consistent response format:
  ```javascript
  {
    success: true/false,
    message: "Descriptive message",
    data: {} // or array
  }
  ```
- Use appropriate HTTP status codes
- Validate all inputs
- Add proper error handling
- Use meaningful route paths

## Development Setup

### Fork & Clone

```bash
git clone https://github.com/YOUR-USERNAME/ecommerce-platform.git
cd ecommerce-platform
```

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Install Dependencies

```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd admin && npm install && cd ..
```

### Create .env Files

See README.md for environment variables setup

### Start Development

```bash
npm run dev
```

### Make Your Changes

1. Make logical, atomic commits
2. Write clear commit messages
3. Test your changes thoroughly
4. Update documentation if needed

### Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### Create a Pull Request

1. Go to GitHub and create a PR from your fork
2. Fill in the PR template
3. Link related issues
4. Request review from maintainers

## Testing

Before submitting a PR, please test your changes:

```bash
# Run all tests
npm test

# Run specific test
npm test -- specific.test.js

# Run with coverage
npm test -- --coverage
```

## Code Review Process

1. At least one maintainer will review your PR
2. Changes may be requested before merging
3. Once approved, your PR will be merged
4. Your contribution will be credited

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `in progress` - Someone is working on it
- `wontfix` - This will not be worked on

### Commit Message Emoji Reference

```
🎨 :art: - Improve code structure/format
⚡ :zap: - Improve performance
🔥 :fire: - Remove code/files
🐛 :bug: - Fix a bug
✨ :sparkles: - Add new feature
📝 :memo: - Add/update docs
🚀 :rocket: - Deploy/release
💄 :lipstick: - UI/styling updates
✅ :white_check_mark: - Add tests
🔒 :lock: - Fix security issues
⬆️ :arrow_up: - Upgrade deps
⬇️ :arrow_down: - Downgrade deps
```

## Community

- Discord: [Join our Discord](#)
- Twitter: [@ShopHubStore](https://twitter.com)
- Email: support@shophub.dev

## Recognition

Contributors will be recognized in:

- Project README
- Release notes
- GitHub contributors page

Thank you for contributing! 🎉

---

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing opinions, viewpoints, and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior include:

- The use of sexualized language or imagery and unwelcome sexual attention or advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as physical or electronic address
- Other conduct which could reasonably be considered inappropriate in a professional setting

### Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at support@shophub.dev. All complaints will be reviewed and investigated.

---

Again, thank you for your interest in contributing! 🚀
