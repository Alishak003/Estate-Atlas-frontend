import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ChildComponentProps{
    url:string,
    handleBack:(stepValue:string)=>void
    handleNext:(stepValue:string)=>void
}

export const TutorialVideo = ({url,handleBack,handleNext}:ChildComponentProps)=>{
    return(<div className="bg-gray-50 md:p-4 flex items-center justify-center">
      <Card className="w-full md:max-w-5xl md:px-10 bg-white shadow-lg border-0 border-t-4 border-blue-400">
        <CardContent className=" py-5 px-6 md:px-12 min-h-[500px]">
          <Button onClick={()=>handleBack("CancellationOffer")}
          className="px-0 shadow-none text-sky-500 py-2 bg-transparent hover:bg-transparent hover:text-sky-600"
          >
          &lt; Back
          </Button>
          <div className="w-full aspect-video rounded-lg overflow-hidden shadow-md">
              <iframe
                src={url}
                title="Embedded Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
            <Button
            onClick={()=>handleNext("CancellationConfirmation")}
              variant="outline"
              className="bg-sky-500 text-white py-4 px-6 border-sky-500 hover:bg-sky-600 my-6"
            >
              No thanks, Continue to Cancel
            </Button> 
        </CardContent>      
      </Card>
    </div>)
}