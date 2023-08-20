
var flyingSaucer;
var cowManager;

function FlyingSaucer(x,y, scale){

        this.x = x;
        this.y = y;
        this.width = 200 * scale;
        this.height = 50 * scale;
        this.window_width = 1.20 * scale;
        this.num_of_lights = 20;
        this.brightnesses = [];
        this.beam_on = false;

        this.hover = function(){
            this.x += random(-0.5,0.5);
            this.y += random(-0.5,0.5); 
            
            if(!this.beamOn && random() > 0.995)
            {
                this.beamOn = true;
            }
            else if(this.beamOn && random() > 0.998)
            {
                this.beamOn = false;
            }
        }
        
        this.beam = function(){
            fill(255,255,100,100)
            
            if(random() > 0.25){
                beginShape();
                vertex(this.x - this.width * 0.25, this.y);
                vertex(this.x + this.width * 0.25, this.y);
                vertex(this.x + this.width, height-80);
                vertex(this.x - this.width, height-80);
                endShape()

                fill(255,255,100,100)
                ellipse(this.x, height-80,
                dist(this.x + this.width, height -80, this.x - this.width, height-80),
                25)

                arc(this.x,
                height-80,
                dist(this.x + this.width, height -80, this.x - this.width, height-80),
                25,
                0,
                PI)
            
            };
        };
        
        this.draw = function(){
            if(!this.beam_on){
                this.beam();
            };

            fill(175,238,238);
            arc(this.x,
                this.y,
                75 * this.window_width,
                this.height * 2,
                PI,
                TWO_PI)
            fill(150);
            arc(this.x,
                this.y,
                this.width,
                this.height,
                PI,
                TWO_PI);
            fill(50);
            arc(this.x,
                this.y,
                this.width,
                this.height/2,
                0,
                PI);
            
            var increment = (this.width/(this.num_of_lights - 1))
            
            for(var i = 0; i < this.num_of_lights; i++){
        
                
                fill(this.brightnesses[i])
                ellipse(
                    this.x - this.width/2 + increment * i,
                    this.y,
                    5
                );

                this.brightnesses[i] += 3;
                this.brightnesses[i] = this.brightnesses[i]%255;
            };
        };

        this.getBeamBoundaries = function(){
            var boundaries = [];
            boundaries.push(this.x - this.width/4);
            boundaries.push(this.x + this.width/4);
            return boundaries;
        }
        
        for(var i = 0; i < this.num_of_lights; i++){
            this.brightnesses.push((i * 7000)%255);
        };
        
};
    
    
    
    function Cow(x,y)
{
    //public
    this.x = x;
    this.y = y;
    this.direction = random(1,2);
    this.flyingSaucerRef = null;
    this.flagForDeletion = false;
    this.isFrozen = false;
    
    //private
    var step = 0;

    if(random() > 0.5)
    {
        this.direction *= -1;    
    }
    
    
    this.draw = function()
    {
        
        push();
        translate(this.x, this.y);
        if(this.direction > 0)
        {
            scale(-1,1);
        }
        
        fill(255,250,240)
        rect(0,-10,10,5);
        
        //legs
        if(step > 5)
        {
            rect(0,-5,2,5);
            rect(8,-5,2,5);
        }
        else
        {
            rect(2,-5,2,5);
            rect(6,-5,2,5);
        }
        
        //head
        rect(-4,-12,4,4);
        
        //markings
        fill(0);
        rect(4,-9,3,3);
        rect(6,-10,2,2);

        pop();
        
    }
    
    this.walk = function()
    {
        this.x += this.direction;
        step = (step + 1)%10;
    }

}


function CowManager()
{
    this.cows = [];
    this.minCows = 10;
    
    this.update = function()
    {
        //add new cows if necessary
        if(this.cows.length < this.minCows)
        {
            this.cows.push(new Cow(width+199, height - 100));
        }
        
        for(var i = 0; i < this.cows.length; i++)
        {
            
            if(!this.cows[i].isFrozen)
            {
                if(this.cows[i].y < height - 100)
                {
                    //falling
                    this.cows[i].y += 3;
                }
                else
                {
                    //regular walking
                    this.cows[i].walk();

                    if(this.cows[i].x > width + 200)
                    {
                        this.cows[i].x = -200;
                    }
                    else if(this.cows[i].x < -200)
                    {
                        this.cows[i].x = width + 200;
                    }
                }
            }
            else
            {
                //reset for next frame
                this.cows[i].isFrozen = false;    
            }
        }
        
        //remove old cows
        for(var i = this.cows.length - 1; i >= 0; i--)
        {
            if(this.cows[i].flagForDeletion)
            {
                this.cows.splice(i,1);
            }
        }
           
        
    }
    
    this.draw = function()
    {
        for(var i = 0; i < this.cows.length; i++)
        {
            this.cows[i].draw();
        }
    }
    
    this.checkForCows = function(x1,x2)
    {
        //returns all cows between the two points
        
        var cows = [];
        
        for(var i = 0; i < this.cows.length; i++)
        {
            if(this.cows[i].x >= x1 && this.cows[i].x <= x2)
            {
                cows.push(this.cows[i]);
            }
        }
        
        return cows;
    }
    
    this.levitateCows = function(boundaries, x_anchor, y_cutoff)
    {
        var cows = this.checkForCows(boundaries[0], boundaries[1]);
        
        //hover up
        for(var i = 0 ; i < cows.length; i++)
        {
            cows[i].x = x_anchor;
            cows[i].y -= 1;
            cows[i].isFrozen = true;
            
            if(cows[i].y < y_cutoff)
            {
                cows[i].flagForDeletion = true;
            }
        }

    }

}

function setup(){
    createCanvas(1200,600);
    noStroke();
    
    flyingSaucer = new FlyingSaucer(width/2, height/4, random(0.5, 1))
    cowManager = new CowManager();
}

function draw(){
    background(50,0,80);
    
    //draw the ground
    fill(0,50,0);
    rect(0,height - 100, width, 100);
    
    cowManager.update();
    cowManager.draw();
    
    flyingSaucer.hover()
    flyingSaucer.draw()

    if(flyingSaucer.beamOn){   
        var b = flyingSaucer.getBeamBoundaries();
        cowManager.levitateCows(b, flyingSaucer.x, flyingSaucer.y);
    };
};
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    