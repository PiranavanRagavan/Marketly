import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/products";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const FilterSidebar = ({
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  selectedCategory,
  onCategoryChange,
}: FilterSidebarProps) => {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Filters</h3>
      </div>

      <Separator />

      {/* Category Filter */}
      <div>
        <Label className="mb-3 text-base font-semibold">Category</Label>
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={category} />
              <Label htmlFor={category} className="font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <Label className="mb-3 text-base font-semibold">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={(value) => onPriceChange(value as [number, number])}
          className="mt-2"
        />
      </div>

      <Separator />

      {/* Rating Filter */}
      <div>
        <Label className="mb-3 text-base font-semibold">
          Minimum Rating: {minRating} stars
        </Label>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[minRating]}
          onValueChange={(value) => onRatingChange(value[0])}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
