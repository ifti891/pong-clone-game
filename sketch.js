function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

class Paddle
{
    constructor(ball)
    {
        this.ball = ball;
        
        this.w = 20;
        this.h = 100;

        this.x = 20;
        this.y = (height - this.h) / 2;
        
        this.upKey = UP_ARROW;
        this.downKey = DOWN_ARROW;
    }
    
    reset( points )
    {
        this.y = (height - this.h) / 2;
        
        this.h -= points * 10;
        if (this.h < 2 * this.ball.r)
        {
            this.h = 2 * this.ball.r;
        }
    }
    
    display()
    {
        fill("brown");
        rect(this.x, this.y, this.w, this.h);
    }
    
    update()
    {
        if (keyIsDown(this.upKey) && this.y > 0)
        {
            this.y -= 10;
        }
        
        else if (keyIsDown(this.downKey) && this.y < height - this.h)
        {
            this.y += 10;
        }
        
        this.checkHit();
    }
    
    checkHit()
    {
        let hit = collisionCircleRect(this.ball.x, this.ball.y, this.ball.r, this.x, this.y, this.w, this.h);
        
        if (hit)
        {
            this.ball.launchBall( this.ball.dx * -1 );
            sound("click2");
        }
    }
}

class LeftPaddle extends Paddle
{
    constructor(ball)
    {
        super(ball);
        
        this.x = 20;
        this.upKey = 81; // "Q";
        this.downKey = 65; // "A";
    }
}

class RightPaddle extends Paddle
{
    constructor(ball)
    {
        super(ball);
        
        this.x = width - this.w - 20;
        this.upKey = UP_ARROW;
        this.downKey = DOWN_ARROW;
    }
}

class Ball
{
    constructor()
    {
        this.x = 400;
        this.y = 300;
        this.r = 10;
        
        this.dx = random([-1, 1]);
        this.dy = random([-1, 1]);
        this.speed = 10;
        this.friction = 0.02;
        
        this.inMotion = false;
    }
    
    reset()
    {
        this.inMotion = false;
    }
    
    display()
    {
        stroke("black");
        fill("teal");
        
        circle(this.x, this.y, this.r);
    }
    
    update()
    {
        if (this.inMotion)
        {
            this.updateInMotion();
        }
        
        else
        {
            this.updateWaiting();
        }
    }
    
    // update behavior when the ball is moving
    updateInMotion()
    {
        this.speed -= this.friction;
        
        if (this.speed < 0)
        {
            this.speed = 0;
        }
        
        this.x += this.dx * this.speed;
        
        // this.y += this.dy * this.speed;
        this.y = this.slope * (this.x - this.x1) + this.y1;
    }
    
    // update behavior while the ball is waiting
    updateWaiting()
    {
        this.x = 400;
        this.y = 300;
        
        if (keyIsDown(32)) // SPACE
        {
            this.launchBall( random([-1, 1]) );
            this.inMotion = true;
        }
    }
    
    launchBall(dx)
    {
        this.dx = dx;
        this.pickSlope();
        
        this.speed = 10;
    }
    
    pickSlope()
    {
        this.x1 = this.x;
        this.y1 = this.y;
        
        this.x2 = this.dx > 0 ? width : 0;
        this.y2 = random(this.r, height - this.r);
        
        this.slope = (this.y2 - this.y1) / (this.x2 - this.x1);
    }
}

class Game
{
    constructor()
    {
        this.ball = new Ball();
        this.leftPaddle = new LeftPaddle(this.ball);
        this.rightPaddle = new RightPaddle(this.ball);
        
        this.leftPoints = 0;
        this.rightPoints = 0;
    }
    
    display()
    {
        this.displayField();
        
        this.leftPaddle.display();
        this.rightPaddle.display();
        this.ball.display();
    }
    
    displayField()
    {
        push();
        stroke("black");
        strokeWeight(4);
        fill("white");
        rect(2, 2, width - 4, height - 4);
        line(width / 2, 0, width / 2, height);
        
        circle(width / 2, height / 2, 50);
        
        textSize(20);
        text(this.leftPoints, 10, 30);
        text(this.rightPoints, width - 20, 30);
        
        
        if (!this.ball.inMotion)
        {
            strokeWeight(1);
            stroke("black");
            fill("white");
            rect(300, 380, 220, 60);
            
            noStroke();
            fill("black");
            textSize(12);
            text("Press SPACE to start the game", 320, 400);
            text("Use Q - A - vs- UP - DOWN!", 340, 420);
        }

        pop();
    }
    
    update()
    {
        this.leftPaddle.update();
        this.rightPaddle.update();
        this.ball.update();
        
        if (this.ball.x < 0)
        {
            this.rightPoints++;
            this.reset();
        }
        
        else if (this.ball.x > width)
        {
            this.leftPoints++;
            this.reset();
        }
    }
    
    reset()
    {
        this.leftPaddle.reset( this.leftPoints );
        this.rightPaddle.reset( this.rightPoints );
        this.ball.reset();
    }
}

let game = new Game();

function loop()
{
    clear();
    
    game.update();
    game.display();
}
