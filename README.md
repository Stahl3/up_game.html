````markdown name=README.md
# Upper Peninsula Hunt & Fish - Educational Math Game

## Overview
An interactive, browser-based educational game for Chromebooks that combines fishing and hunting activities in Michigan's Upper Peninsula with math practice. Students solve math problems to catch fish and hunt animals while learning about local wildlife.

## Features

### Game Modes

#### 🎣 **Fishing Mode**
- **Casting Mechanics**: Click and drag your mouse to cast your fishing line at different angles
- **Interactive Fish**: Realistic fish swim across the water
- **Real UP Fish Species**:
  - Walleye
  - Lake Trout
  - Northern Pike
  - Largemouth Bass
  - Muskie

#### 🦌 **Hunting Mode**
- **Aiming Mechanics**: Move your mouse to aim your rifle with a realistic crosshair
- **Click to Shoot**: Click to take your shot
- **Real UP Animals**:
  - White-tailed Deer
  - Black Bear
  - Wild Turkey
  - Moose
  - Porcupine

### Math Content

#### **Multiplication & Division** (Within 100)
- Multiplication tables from 2×2 to 10×10
- Corresponding division problems
- Example: "8 × 7 = ?" or "56 ÷ 8 = ?"

#### **Addition & Subtraction** (Within 1000)
- Addition problems combining values up to 1000
- Subtraction problems with differences up to 1000
- Example: "250 + 175 = ?" or "800 - 350 = ?"

### Game Features

✅ **Realistic Graphics**
- Canvas-based 2D graphics for smooth animations
- Realistic character and animal designs
- Detailed water and forest scenes

✅ **Dynamic Question Generation**
- Questions change after each answer
- Four multiple-choice options per question
- Immediate feedback (correct/incorrect)

✅ **Score Tracking**
- Real-time score display
- Count of animals caught
- Points awarded for correct answers

✅ **Leaderboard System**
- Separate leaderboards for fishing and hunting
- Top 50 scores saved per category
- Persistent storage using browser localStorage

✅ **Chromebook Compatible**
- No installation required
- Runs entirely in the browser
- Works on all devices with modern browsers

## How to Play

### Starting the Game
1. Open `index.html` in a web browser
2. Enter your name in the text field
3. Click **"Go Fishing"** or **"Go Hunting"** to begin

### Fishing Instructions
1. You'll see fish swimming in the water
2. **Click and drag** your mouse to aim your fishing line
3. The longer you drag, the further you cast
4. Drag at an angle to aim your hook at the fish
5. When you release, if you catch a fish, a math question appears
6. **Answer correctly** to add the fish to your catch
7. Drag again to cast and catch another fish

### Hunting Instructions
1. You'll see animals moving through the forest
2. **Move your mouse** to aim your rifle (see the red crosshair)
3. **Click** when you're aimed at an animal
4. If you hit, a math question appears
5. **Answer correctly** to add the animal to your catch
6. Click again to take another shot

### Answering Questions
- Read the math problem on screen
- Click the correct answer from the four options
- Green highlight = Correct answer (continue playing)
- Red highlight = Wrong answer (try the same activity again)
- Questions change after each attempt

## Scoring System

- **Points per Catch**: 10 points for each correct answer
- **Total Score**: Sum of all correct answers
- **Total Caught**: Number of animals successfully caught
- **Leaderboard**: Rankings based on total score

## Files Included

- **index.html** - Main HTML structure with all game screens
- **styles.css** - Complete styling for all UI elements
- **game.js** - Game logic, graphics, and interactivity
- **README.md** - This documentation file

## Browser Requirements

- Modern web browser (Chrome, Edge, Firefox, Safari)
- JavaScript enabled
- LocalStorage support for leaderboard
- Canvas support for graphics

## Chromebook Compatibility

✅ Works on all Chromebooks
✅ No software installation needed
✅ Run directly in Chrome browser
✅ Persistent storage between sessions
✅ Works offline (once loaded)

## Class Usage

### For Teachers
1. Share the game link with your students
2. Have students enter their name and choose fishing or hunting
3. Students work through math problems by playing
4. Check the leaderboard to see student performance
5. Each student can play multiple sessions

### Scoring
- Each correct answer = 10 points
- Multiple sessions encouraged to improve scores
- Leaderboard shows top 50 scores per category
- Great for competitive learning!

## Customization

### Adding More Questions
Edit the `initializeQuestions()` function in `game.js` to add custom question ranges:
```javascript
// Example: Change multiplication range from 2×2-10×10 to 3×3-12×12
for (let i = 3; i <= 12; i++) {
    for (let j = 3; j <= 12; j++) {
        if (i * j <= 144) {
            questionDatabase.multiplication.push({...});
        }
    }
}
```

### Changing Animals or Fish
Edit the `upAnimals` object in `game.js`:
```javascript
const upAnimals = {
    fishing: [
        { name: 'Your Fish', emoji: '🐟', description: 'Description' },
        // Add more...
    ],
    hunting: [
        { name: 'Your Animal', emoji: '🦌', description: 'Description' },
        // Add more...
    ]
};
```

## Technical Details

### Game Architecture
- **Canvas Rendering**: Smooth 60fps animations using requestAnimationFrame
- **Event Listeners**: Mouse movement and click detection for intuitive controls
- **LocalStorage API**: Persistent leaderboard data
- **Responsive Design**: Adapts to different screen sizes

### Math Question Generation
- Dynamic question creation from predefined ranges
- Randomized multiple-choice options (all unique)
- No question repetition within a single session
- Balanced difficulty across operations

## Troubleshooting

**Leaderboard not saving?**
- Check if localStorage is enabled in browser settings
- Clear browser cache and try again

**Graphics not displaying?**
- Ensure JavaScript is enabled
- Try a different browser
- Check browser console for errors

**Game runs slowly?**
- Close unnecessary browser tabs
- Disable browser extensions
- Update your browser

## Future Enhancements

- Sound effects and background music
- Difficulty levels (easy/medium/hard)
- Timed challenges
- Multiplayer modes
- Additional UP locations and biomes
- Daily challenges and achievements

## License & Credits

Created for educational purposes. Features realistic depictions of Upper Peninsula wildlife and scenery.

### Educational Standards
- Aligns with Common Core mathematics standards
- Multiplication/Division: Grade 3-4
- Addition/Subtraction: Grade 2-3
- Engagement through game-based learning

---

**Enjoy the game and happy learning!** 🎣🦌
````
